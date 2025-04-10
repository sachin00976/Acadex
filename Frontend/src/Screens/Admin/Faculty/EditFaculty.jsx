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
  const [branch, setBranch] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm({
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
      .patch(`/api/v1/faculty/updateDetail`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
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

    const headers = {
      'Content-Type': 'application/json',
    };

    axios
      .get("/api/v1/branch/getBranch", { headers })
      .then((response) => {
        if (response.data.data) {
          setBranch(response.data.data);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(() => {});

    axios
      .post(`/api/v1/faculty/getDetail`, { employeeId: search }, { headers })
      .then((response) => {
        toast.dismiss();
        const faculty = response.data?.data;
        if (!faculty || Object.keys(faculty).length === 0) {
          toast.error('No Faculty Found!');
        } else {
          toast.success(response.data.message);
          setId(faculty._id);
          setPreviewImage(faculty.profile?.url || '');
          reset({
            employeeId: faculty.employeeId || '',
            firstName: faculty.firstName || '',
            middleName: faculty.middleName || '',
            lastName: faculty.lastName || '',
            email: faculty.email || '',
            phoneNumber: faculty.phoneNumber || '',
            department: faculty.department || '',
            gender: faculty.gender || '',
            experience: faculty.experience || '',
            post: faculty.post || '',
            profile: faculty.profile?.url || '',
          });
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error?.response?.data?.message || 'Search failed');
        clearSearchHandler();
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
    <div className="my-10 mx-auto w-full px-4">
      <form
        onSubmit={searchFacultyHandler}
        className="flex justify-center items-center border border-blue-500 rounded-xl w-full sm:w-[60%] mx-auto overflow-hidden shadow-md"
      >
        <input
          type="text"
          className="px-4 py-3 w-full outline-none text-sm"
          placeholder="Enter Employee ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search ? (
          <button
            type="button"
            className="px-5 py-3 bg-red-500 text-white hover:bg-red-600 transition duration-200"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              clearSearchHandler();
            }}
          >
            <FiX className="text-xl pointer-events-none" />
          </button>
        ) : (
          <button
            className="px-5 py-3 bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
            type="submit"
          >
            <FiSearch className="text-xl" />
          </button>
        )}
      </form>

      {search && id && (
        <form
          onSubmit={handleSubmit(updateFacultyProfile)}
          className="w-full sm:w-[80%] flex flex-wrap justify-center gap-6 mx-auto mt-10"
        >
          {["firstName", "middleName", "lastName", "employeeId", "phoneNumber", "email", "experience"].map((name) => (
            <div key={name} className="w-full sm:w-[45%]">
              <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
                {name === "employeeId" ? "Employee ID" :
                 name === "phoneNumber" ? "Phone Number" :
                 name === "email" ? "Email" :
                 name === "experience" ? "Experience" :
                 `Enter ${name.charAt(0).toUpperCase() + name.slice(1)}`}
              </label>
              <input
                {...register(name)}
                type={name === "employeeId" || name === "phoneNumber" || name === "experience" ? "number" : "text"}
                id={name}
                disabled={name === "employeeId"}
                min={name === "experience" ? 0 : undefined}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          ))}

          <div className="w-full sm:w-[45%]">
            <label htmlFor="department" className="block mb-1 text-sm font-medium text-gray-700">
              Select Department
            </label>
            <select
              id="department"
              {...register("department", { required: true })}
              className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
            >
              <option value="">-- Select --</option>
              {branch?.map((branch) => (
                <option value={branch.name} key={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
            {errors.department && <span className="text-red-500 text-xs">Department is required</span>}
          </div>

          <div className="w-full sm:w-[45%]">
            <label htmlFor="gender" className="block mb-1 text-sm font-medium text-gray-700">
              Select Gender
            </label>
            <select
              id="gender"
              {...register("gender", { required: true })}
              className="px-2 bg-blue-50 py-3 rounded-lg text-base w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
            >
              <option value="">-- Select --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="w-full sm:w-[45%]">
            <label htmlFor="post" className="block mb-1 text-sm font-medium text-gray-700">
              Select Post
            </label>
            <select
              id="post"
              {...register("post", { required: true })}
              className="px-2 bg-blue-50 py-3 rounded-lg text-base w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
            >
              <option value="">-- Select --</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="HOD">HOD</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Visiting Faculty">Visiting Faculty</option>
              <option value="Lab Assistant">Lab Assistant</option>
              <option value="Technical Assistant">Technical Assistant</option>
            </select>
          </div>

          <div className="w-full sm:w-[45%]">
            <label htmlFor="file" className="block mb-1 text-sm font-medium text-gray-700">
              Select New Profile
            </label>
            <label
              htmlFor="file"
              className="w-full flex justify-center items-center border border-blue-300 rounded-lg px-4 py-2 bg-blue-50 cursor-pointer hover:bg-blue-100 transition"
            >
              Upload <FiUpload className="ml-2" />
            </label>
            <input hidden type="file" id="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {(previewImage || getValues('profile')) && (
            <div className="w-full flex justify-center">
              <img
                src={previewImage || getValues('profile')}
                alt="Faculty"
                className="h-36 w-36 object-cover rounded-full border shadow"
                onError={(e) => { e.target.src = '/default-avatar.png'; }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            {isSubmitting ? 'Updating...' : 'Update Faculty'}
          </button>
          <button
            type="button"
            className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition shadow-md ml-4"
            onClick={() => clearSearchHandler()}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default EditFaculty;
