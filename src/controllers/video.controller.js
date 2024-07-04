import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {
    uploadOnCloudinary,
    destroyCloudImage,
    destroyCloudVideo
} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = 1, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video
    if (!(title && description)) {
        throw new ApiError(400, "Please provide title and description")
    }

    const videoFileLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    //    console.log(req.files);

    if (!(videoFileLocalPath && thumbnailLocalPath)) {
        throw new ApiError(400, "Video file and Thumbnail, both are required ")
    }
    const video = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!video || !thumbnail) {
        throw new ApiError(400, " video file and thumbnail are required")
    }
    const videoPublish = await Video.create({
        title, description,
        videoFile: {
            url: video.secure_url,
            public_id: video.public_id
        },
        thumbnail: {
            url: thumbnail.secure_url,
            public_id: thumbnail.public_id
        },
        duration: video.duration,
        owner: req.user._id

    })
    if (!videoPublish) {
        throw (500, "Error while uploading the video")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200, videoPublish, "video uploaded successfully"
            )
        )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video id")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(400, "video not found")

    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video Fetched Successfully")
        )

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video id")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(400, "video not found")
    }
    
    const { description, title } = req.body
    if (!(description && title)) {
        throw new ApiError(400, "All fields are required")
    }
    
    
    if (req.file?.path !== "") {
        await destroyCloudImage(video.thumbnail.public_id)
    }
    
    const thumbnailLocalPath = req.file?.path
    
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "thumbnail file is missing")
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if (!thumbnail) { throw new ApiError(400, "thumbnail file is missing") }
    
    const updateVideoDetails=await Video.findByIdAndUpdate(
        video,
        {
            thumbnail:{
                url:thumbnail.secure_url,
                public_id:thumbnail.public_id,
            },
            title,
            description
        },
        {new:true,}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,updateVideoDetails,"Video details updated successfully")
    )


})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video id")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(400, "video not found")
    }

    await destroyCloudImage(video.videoFile.public_id)
    await destroyCloudVideo(video.thumbnail.public_id)
    await Video.findByIdAndDelete(videoId)
    return res.status(200)
        .json(
            new ApiResponse(200, {}, "Video deleted successfully")
        )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "Video not found")
    }
    video.isPublished=!video.isPublished
    await video.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new ApiResponse(200 ,video,"isPublished toggled successfully")
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}