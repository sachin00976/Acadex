import React, { useState } from 'react';
import axios from "axios";
import { toast } from "react-hot-toast";
import Heading from '../../components/Heading';
import { BiArrowBack } from 'react-icons/bi';

const Marks = () => {
  const [studentData, setStudentData] = useState([]);
  const [selected, setSelected] = useState({
    branch: '',
    semester: '',
    subject: '',
    examType: ''
  });

  const branch = [
    { name: "Computer Science" },
    { name: "Biotechnology" },
    { name: "Mechenical" },
    { name: "Electronic and Communication" },
    { name: "Electrical Engineering" }
  ];

  const subject = [{ name: "OS" }, { name: "AI" }, { name: "chemical" }];

  const loadStudentDetails = async () => {
    if (!selected.branch || !selected.semester) {
      toast.error("Please select branch and semester.");
      return;
    }

    try {
      const res = await axios.post('/api/v1/student/all', {
        branch: selected.branch,
        semester: Number(selected.semester)
      });

      setStudentData(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch students");
    }
  };

  const submitMarksHandler = async () => {
    if (!selected.branch || !selected.semester || !selected.subject || !selected.examType) {
      toast.error("Please select all dropdown options.");
      return;
    }

    const requests = studentData.map(student => {
      const value = document.getElementById(`${student.enrollmentNo}marks`).value;

      const payload = {
        enrollmentNo: student.enrollmentNo,
        [selected.examType]: {
          [selected.subject]: Number(value)
        }
      };

      return axios.post('/api/v1/marks/addMarks', payload);
    });

    try {
      await Promise.all(requests);
      toast.success("Marks uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Upload failed.");
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 transition-all duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="relative flex justify-between items-center mb-8">
          <Heading title={`Upload Marks`} />
          {studentData.length > 0 && (
            <button
              className="absolute right-0 flex items-center gap-2 border border-red-500 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition"
              onClick={() => setStudentData([])}
            >
              <BiArrowBack className="text-lg" />
              Close
            </button>
          )}
        </div>

        <div className="transition-opacity duration-500 ease-in-out">
          {studentData.length === 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-6 rounded-xl shadow-xl border border-blue-100 animate-fade-in">
                {[
                  { id: 'branch', label: 'Branch', options: branch.map(b => b.name) },
                  { id: 'semester', label: 'Semester', options: Array.from({ length: 8 }, (_, i) => i + 1) },
                  { id: 'subject', label: 'Subject', options: subject.map(s => s.name) },
                  { id: 'examType', label: 'Exam Type', options: ['internal', 'external'] }
                ].map(({ id, label, options }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <select
                      id={id}
                      value={selected[id]}
                      onChange={(e) => setSelected(prev => ({ ...prev, [id]: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 bg-white transition"
                    >
                      <option value="">-- Select --</option>
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {id === 'semester' ? `${opt} Semester` : opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={loadStudentDetails}
                  className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-md hover:bg-blue-700 transition"
                >
                  Load Student Data
                </button>
              </div>
            </>
          ) : (
            <div className="animate-fade-in">
              <p className="text-lg mt-6 mb-4 font-semibold text-gray-700">
                Upload <span className="text-blue-600 capitalize">{selected.examType}</span> marks for{" "}
                <span className="text-blue-600">{selected.branch}</span> -{" "}
                <span className="text-blue-600">{selected.semester} Semester</span> -{" "}
                {selected.subject}
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentData.map((student) => (
                  <div
                    key={student.enrollmentNo}
                    className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-lg transition"
                  >
                    <span className="font-semibold text-gray-800">{student.enrollmentNo}</span>
                    <input
                      type="number"
                      placeholder="Enter Marks"
                      id={`${student.enrollmentNo}marks`}
                      className="ml-4 border border-gray-300 rounded-md px-4 py-2 w-1/2 focus:ring-2 focus:ring-blue-400 outline-none transition"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <button
                  onClick={submitMarksHandler}
                  className="bg-green-600 text-white px-10 py-3 rounded-full shadow-lg hover:bg-green-700 transition"
                >
                  Upload Student Marks
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marks;
