import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FiSearch, FiUpload, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';

const EditFaculty = () => {
  const [file, setFile] = useState();
  const [previewImage, setPreviewImage] = useState('');
  const [search, setSearch] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [id, setId] = useState('');
  const { register, handleSubmit, setValue, reset, getValues } = useForm({
    defaultValues: {
      employeeId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      department: '',
      gender: '',
      experience: '',
      post: '',
      profile: ''
    }
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const imageUrl = URL.createObjectURL(selectedFile);
    setPreviewImage(imageUrl);
  };

  const updateFacultyProfile = (data) => {
    toast.loading('Updating Profile');

    const formData = new FormData();
    formData.append('employeeId', data.employeeId);
    formData.append('firstName', data.firstName);
    formData.append('middleName', data.middleName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('department', data.department);
    formData.append('experience', data.experience);
    formData.append('gender', data.gender);
    formData.append('post', data.post);

    if (file) {
      formData.append('type', 'profile');
      formData.append('profile', file);
    }

    axios
      .put(``, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          clearSearchHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error?.response?.data?.message || 'Update failed');
      });
  };

  const searchFacultyHandler = (e) => {
    e.preventDefault();
    setSearchActive(true);
    toast.loading('Getting Faculty');

    axios
      .post(``, { employeeId: search }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.user.length === 0) {
          toast.error('No Faculty Found!');
        } else {
          toast.success(response.data.message);
          const faculty = response.data.user[0];
          setId(faculty._id);
          setPreviewImage('');
          Object.keys(faculty).forEach((key) => {
            if (key in getValues()) {
              setValue(key, faculty[key]);
            }
          });
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error?.response?.data?.message || 'Search failed');
      });
  };

  const clearSearchHandler = () => {
    setSearchActive(false);
    setSearch('');
    setId('');
    setPreviewImage('');
    reset();
  };

  return (
    <div className="my-6 mx-auto w-full">
      <form onSubmit={searchFacultyHandler} className="flex justify-center items-center border-2 border-blue-500 rounded w-[40%] mx-auto">
        <input type="text" className="px-6 py-3 w-full outline-none" placeholder="Employee Id" value={search} onChange={(e) => setSearch(e.target.value)} />
        {!searchActive ? (
          <button className="px-4 text-2xl hover:text-blue-500" type="submit">
            <FiSearch />
          </button>
        ) : (
          <button className="px-4 text-2xl hover:text-blue-500" type="button" onClick={clearSearchHandler}>
            <FiX />
          </button>
        )}
      </form>

      {search && id && (
        <form onSubmit={handleSubmit(updateFacultyProfile)} className="w-[70%] flex justify-center items-center flex-wrap gap-6 mx-auto mt-10">
          <div className="w-[40%]">
            <label htmlFor="firstName" className="leading-7 text-sm">Enter First Name</label>
            <input {...register('firstName')} type="text" id="firstName" className="input-style" />
          </div>

          <div className="w-[40%]">
            <label htmlFor="middleName" className="leading-7 text-sm">Enter Middle Name</label>
            <input {...register('middleName')} type="text" id="middleName" className="input-style" />
          </div>

          <div className="w-[40%]">
            <label htmlFor="lastName" className="leading-7 text-sm">Enter Last Name</label>
            <input {...register('lastName')} type="text" id="lastName" className="input-style" />
          </div>

          <div className="w-[40%]">
            <label htmlFor="employeeId" className="leading-7 text-sm">Employee ID</label>
            <input {...register('employeeId')} type="number" id="employeeId" disabled className="input-style" />
          </div>

          <div className="w-[40%]">
            <label htmlFor="phoneNumber" className="leading-7 text-sm">Phone Number</label>
            <input {...register('phoneNumber')} type="number" id="phoneNumber" className="input-style" />
          </div>

          <div className="w-[40%]">
            <label htmlFor="email" className="leading-7 text-sm">Email</label>
            <input {...register('email')} type="email" id="email" className="input-style" />
          </div>

          <div className="w-[40%]">
            <label htmlFor="post" className="leading-7 text-sm">Post</label>
            <input {...register('post')} type="text" id="post" className="input-style" />
          </div>

          <div className="w-[40%]">
            <label htmlFor="experience" className="leading-7 text-sm">Experience</label>
            <input {...register('experience')} type="number" id="experience" className="input-style" />
          </div>

          <div className="w-[40%]">
            <label htmlFor="file" className="leading-7 text-sm">Select New Profile</label>
            <label htmlFor="file" className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full flex justify-center items-center cursor-pointer">
              Upload <span className="ml-2"><FiUpload /></span>
            </label>
            <input hidden type="file" id="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {previewImage && (
            <div className="w-full flex justify-center items-center">
              <img src={previewImage} alt="Faculty Image" className="h-36" />
            </div>
          )}

          {!previewImage && getValues('profile') && (
            <div className="w-full flex justify-center items-center">
              <img src={getValues('profile')} alt="faculty" className="h-36" />
            </div>
          )}

          <button type="submit" className="bg-blue-500 px-6 py-3 rounded-sm mt-6 text-white">
            Update Faculty
          </button>
        </form>
      )}
    </div>
  );
};

export default EditFaculty;
