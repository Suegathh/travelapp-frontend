import React, { useState, useEffect } from 'react';
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md';
import DateSelector from './DateSelector';
import ImageSelector from './ImageSelector';
import TagInput from './TagInput';
import axiosInstance from '../utilis/axiosInstance';
import moment from 'moment';
import { toast } from 'react-toastify';
import uploadImage from '../utilis/uploadImage';

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [visitDate, setVisitDate] = useState(storyInfo?.visitDate || null);
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Component mounted or updated');
    if (type === "edit" && storyInfo) {
      setVisitDate(storyInfo.visitDate);
      setTitle(storyInfo.title);
      setStoryImg(storyInfo.imageUrl);
      setStory(storyInfo.story);
      setVisitedLocation(storyInfo.visitedLocation);
    }
  }, [type, storyInfo]);

  const handleImageUpload = async (image) => {
    try {
      console.log('Uploading image:', image); // Log the image being uploaded
      const imgUploadRes = await uploadImage(image);
      console.log('Image upload response:', imgUploadRes); // Log the response from the server
      return imgUploadRes.imageUrl || '';
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
      return '';
    }
  };
  

  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitDate: visitDate ? moment(visitDate).valueOf() : moment().valueOf(),
      });
      if (response.data && response.data.story) {
        toast.success("Story Added successfully");
        getAllTravelStories();
        onClose();
      }
    } catch (error) {
      console.error("Error adding new travel story:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Try again later.");
      }
    }
  };

  const updateTravelStory = async () => {
    const storyId = storyInfo._id;
    try {
      let imageUrl = "";
      let postData = {
        title,
        story,
        imageUrl: storyInfo.imageUrl || "",
        visitedLocation,
        visitDate: visitDate ? moment(visitDate).valueOf() : moment().valueOf(),
      };

      if (typeof storyImg === "object") {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
        postData.imageUrl = imageUrl;
      }

      const response = await axiosInstance.put(`/edit-story/${storyId}`, postData);

      if (response.data && response.data.story) {
        toast.success("Story Updated successfully");
        getAllTravelStories();
        onClose();
      }
    } catch (error) {
      console.error("Error updating travel story:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Try again later.");
      }
    }
  };

  const handleAddOrUpdateClick = () => {
    console.log('Add or Update button clicked');
    if (!title) {
      setError("Please enter the Title");
      return;
    }
    if (!story) {
      setError("Please enter the Story");
      return;
    }
    setError("");

    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  };

  const handleDeleteStoryImg = async () => {
    try {
      const deleteImgRes = await axiosInstance.delete("/delete-image", {
        params: {
          imageUrl: storyInfo.imageUrl,
        },
      });

      if (deleteImgRes.data) {
        const storyId = storyInfo._id;
        const postData = {
          title,
          story,
          visitDate: moment().valueOf(),
          visitedLocation,
          imageUrl: "",
        };

        const response = await axiosInstance.put(`/edit-story/${storyId}`, postData
        );
        setStoryImg(null);
      }
    } catch (error) {
      console.error("Error deleting story image:", error);
      setError("Failed to delete image. Please try again.");
    }
  };

  return (
    <div className='relative'>
      <div className='flex items-center justify-between'>
        <h5 className='text-xl font-medium text-slate-700'>
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        <div>
          <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-lg'>
            <button className='btn-small' onClick={handleAddOrUpdateClick}>
              {type === 'add' ? <MdAdd className='text-lg' /> : <MdUpdate className='text-lg' />}
              {type === 'add' ? "Add Story" : "Update Story"}
            </button>
            {type === 'edit' && (
              <button className='btn-small btn-delete' onClick={onClose}>
                <MdDeleteOutline className='text-lg' /> Delete
              </button>
            )}
            <button className='' onClick={onClose}>
              <MdClose className='text-lg text-slate-400' />
            </button>
          </div>
          {error && (
            <p className='text-red-500 text-xs pt-2 text-right'>{error}</p>
          )}
        </div>
      </div>

      <div className='flex-1 flex flex-col gap-2 pt-4'>
        <label className='input-label'>Title</label>
        <input
          type="text"
          className='text-2xl text-slate-950 outline-none'
          placeholder='A day at the Great Wall'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />

        <div className='my-3'>
          <DateSelector date={visitDate} setDate={setVisitDate} />

          <ImageSelector
            image={storyImg}
            setImage={setStoryImg}
            handleDeleteImg={handleDeleteStoryImg}
          />
        </div>

        <div className='flex flex-col gap-2 mt-4'>
          <label className='input-label'>STORY</label>
          <textarea
            type="text"
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder='Your Story'
            rows={10}
            value={story}
            onChange={({ target }) => setStory(target.value)}
          />
        </div>

        <div className='pt-3'>
          <label className='input-label'>VISITED LOCATIONS</label>
          <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
