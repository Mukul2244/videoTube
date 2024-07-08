import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id")

    const options = {
        page,
        limit,
    };

    const video=await Video.findById(videoId)

    const allComments=  await Comment.aggregate([
        {
            $match:{
                video: new mongoose.Types.ObjectId(videoId),
            }
        },
         // sort by date
       {
        $sort:{
            createdAt:-1
        }
       },
        // fetch likes of Comment
     
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, allComments, "All comments Sent"));
})


const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { content } = req.body
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID")    
     if (!content)   throw new ApiError(400, "Comment cannot be empty")
    
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id,
    })
    if (!comment) throw new ApiError(500, "Error while adding comment");

    const { username, avatar, fullName, _id } = req.user;
  
    const commentData = {
      ...comment._doc,
      owner: { username, avatar, fullName, _id },
      likesCount: 0,
      isOwner: true,
    };
    return res
        .status(200)
        .json(
            new ApiResponse(
                200, commentData, "Comment Published Successfully"
            )
        )

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const{commentId}=req.params
    const {content}=req.body
    if (!isValidObjectId(commentId)) throw new ApiError(400, "Invalid Comment Id");
    if (!content) throw new ApiError(400, "No Comment Found");
    const newComment=await Comment.findByIdAndUpdate(commentId,
        {
            $set:{
                content,
            }
        },
        {
            new:true
        }
    )

    if (!newComment) throw new ApiError(500, "Error while editing comment");
    return res
      .status(200)
      .json(new ApiResponse(200, newComment, "Comment updated successfully"));

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId}=req.params
    if (!isValidObjectId(commentId)) throw new ApiError(400, "Invalid Comment Id");
    const comment=await Comment.findByIdAndDelete(commentId)
    if (!comment) throw new ApiError(500, "Error while deleting comment");
    const likes=await Like.deleteMany({
        comment:new mongoose.Types.ObjectId(commentId)
    })
   
    return res
    .status(200)
    .json(
       new ApiResponse(200,{isDeleted:true},"Comment deleted Successfully")
    )


})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}