import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userSelectedChat, updateUserChat } from '../../features/authSlice.js';

function EditGroup({ setOpenEditGroup }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.auth.selectedChat);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: selectedChat.chatName,
    },
  });

  const [preview, setPreview] = useState(
    selectedChat.profile ? selectedChat.profile.url : null
  );
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      setPreview(URL.createObjectURL(file));
    }
  };

  const onClose = () => {
    setOpenEditGroup(false);
  };

  const EditGroupHandler = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);

    
    if (imageInputRef.current?.files?.length > 0) {
      formData.append('image', imageInputRef.current.files[0]);
    }
    
    try {
      setLoading(true);
      const response = await axios.put(
        `/api/v1/chat/editGroup/${selectedChat._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      dispatch(updateUserChat({ chat: response.data.data }));
      dispatch(userSelectedChat({ selectedChat: response.data.data }));
      toast.success('Group updated successfully');
      onClose();
    } catch (error) {
      console.log('Error occurred while updating group:', error.message);
      toast.error(error.response?.data?.message || 'Failed to update Group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
          disabled={loading}
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Edit Group
        </h2>

        <form onSubmit={handleSubmit(EditGroupHandler)} className="space-y-4">
          {/* Group Name */}
          <div>
            <label className="block font-medium text-gray-700">Group Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              type="text"
              placeholder="Enter group name"
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Group Image */}
          <div>
            <label className="block font-medium text-gray-700">Upload Group Profile</label>
            <input
              {...register('image')}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={(e) => {
                register('image').ref(e);
                imageInputRef.current = e;
              }}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
              disabled={loading}
            />
            {preview && (
              <div className="relative inline-block mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreview(selectedChat.profile ? selectedChat.profile.url : null);
                    if (imageInputRef.current) {
                      imageInputRef.current.value = null;
                    }
                  }}
                  className="absolute top-0 right-0 bg-black rounded-3xl p-1 text-red-500 hover:bg-red-100"
                  disabled={loading}
                >
                  ×
                </button>
                <img
                  src={preview}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-xl border"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-semibold py-2 px-4 rounded-md transition duration-200`}
          >
            {loading ? 'Editing...' : 'Edit Group'}
          </button>
        </form>
      </div>
    </div>
  );
}

export { EditGroup };