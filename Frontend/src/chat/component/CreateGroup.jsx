import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userSelectedChat, userChat } from '../../features/authSlice.js';

function CreateGroup({ setOpenCreateGroup }) {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.auth.chats);

  const imageFile = watch('image');

  useEffect(() => {
    if (imageFile && imageFile.length > 0 && imageFile[0] instanceof File) {
      const file = imageFile[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [imageFile]);

  const onClose = () => {
    setOpenCreateGroup(false);
  };

  const createGroupHandler = async (data) => {
    if (!data.name) {
      toast.error('Group name is required.');
      return;
    }
    if (!data.image || data.image.length === 0) {
      toast.error('Image is required to create a group.');
      return;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('image', data.image[0]);

    try {
      setLoading(true);
      const response = await axios.post('/api/v1/chat/createGroup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

       dispatch(userSelectedChat({ selectedChat: response.data.data }));
      dispatch(userChat({ chats: [response.data.data, ...chats] }));

      toast.success('Group created successfully');
      onClose();
      reset();

    } catch (error) {
      console.error('Failed to create Group', error);
      toast.error(error.response?.data?.message || 'Failed to create Group');
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
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Create New Group</h2>

        <form onSubmit={handleSubmit(createGroupHandler)} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Group Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              type="text"
              placeholder="Enter group name"
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Upload Group Profile</label>
            <input
              type="file"
              {...register('image', { required: 'Image is required' })}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
              disabled={loading}
              accept="image/*"
            />
            {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
            {preview && (
              <div className="relative inline-block mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setValue('image', null);
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-semibold py-2 px-4 rounded-md transition duration-200`}
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      </div>
    </div>
  );
}

export { CreateGroup };