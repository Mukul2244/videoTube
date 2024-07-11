
import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body
    if (!content) throw new ApiError(400, "Tweet content is required")

    const createdTweet = await Tweet.create({
        content, owner: req.user?._id
    })
    if (!createdTweet) throw new ApiError(500, "Error occured while creating the tweet")

    let newTweet = {
        ...createdTweet._doc,
        //  content:createdTweet._doc.content,
        owner: {
            fullname: req.user?.fullname,
            username: req.user?.username,
            avatar: req.user?.avatar,
        },
        totalDisLikes: 0,
        totalLikes: 0,
        isLiked: false,
        isDisLiked: false,
    };

    return res
        .status(200)
        .json(new ApiResponse(200, newTweet, "tweet created successfully"));
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params
    const { content } = req.body
    if (!content)
        throw new ApiError(400, "tweet content is required ")
    if (!isValidObjectId(tweetId))
        throw new ApiError(400, "Invalid Tweet Id")

    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId,
        {
            $set: {
                content,
            }
        },
        {
            new: true,
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedTweet,"Tweet Updated Successfully")
        )



})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.params
    if(!isValidObjectId(tweetId)) 
        throw new ApiError(400,"Invalid tweet Id")

    const deletedTweet=await Tweet.findByIdAndDelete(tweetId)

    if(!deletedTweet)
         throw new ApiError(400,"Tweet not fonud")

    const deleteLikes = await Like.deleteMany({
        tweet: new mongoose.Types.ObjectId(tweetId),
      });

    return res
    .status(200)
    .json(
        new ApiResponse(200 ,deletedTweet,"Tweet deleted Successfully")
    )
    
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
