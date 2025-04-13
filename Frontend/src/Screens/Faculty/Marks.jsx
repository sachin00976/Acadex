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

  const branch = [{ name: "CSE" }, { name: "ECE" }, { name: "Mech" }];
  const subject = [{ name: "OS" }, { name: "AI" }, { name: "chemical" }];

  const loadStudentDetails = () => {
    const mockStudents = [
      { enrollmentNo: 'CSE001' },
      { enrollmentNo: 'CSE002' },
      { enrollmentNo: 'CSE003' }
    ];
    setStudentData(mockStudents);
  };

  const submitMarksHandler = () => {
    const marks = studentData.map(student => {
      const value = document.getElementById(`${student.enrollmentNo}marks`).value;
      return { enrollmentNo: student.enrollmentNo, marks: value };
    });
    console.log('Submitting:', marks);
    toast.success('Marks uploaded successfully!');
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-10 px-4 transition-all duration-300">
      <div className="relative flex justify-between items-center mb-6">
        <Heading title={`Upload Marks`} />
        {studentData.length > 0 && (
          <button
            className="absolute right-0 flex items-center gap-2 border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50 transition"
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg animate-fade-in">
              {[
                { id: 'branch', label: 'Branch', options: branch.map(b => b.name) },
                { id: 'semester', label: 'Semester', options: Array.from({ length: 8 }, (_, i) => `${i + 1} Semester`) },
                { id: 'subject', label: 'Subject', options: subject.map(s => s.name) },
                { id: 'examType', label: 'Exam Type', options: ['internal', 'external'] }
              ].map(({ id, label, options }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
                  <select
                    id={id}
                    value={selected[id]}
                    onChange={(e) => setSelected(prev => ({ ...prev, [id]: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <option>-- Select --</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={loadStudentDetails}
                className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
              >
                Load Student Data
              </button>
            </div>
          </>
        ) : (
          <div className="animate-fade-in">
            <p className="text-lg mt-6 mb-4 font-semibold text-gray-700 transition">
              Upload <span className="text-blue-600 capitalize">{selected.examType}</span> Marks of <span className="text-blue-600">{selected.branch}</span> - Semester <span className="text-blue-600">{selected.semester}</span> - {selected.subject}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentData.map((student) => (
                <div
                  key={student.enrollmentNo}
                  className="border border-gray-300 rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition"
                >
                  <span className="font-medium text-gray-800">{student.enrollmentNo}</span>
                  <input
                    type="number"
                    placeholder="Enter Marks"
                    id={`${student.enrollmentNo}marks`}
                    className="border rounded px-4 py-2 w-1/2 text-right focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={submitMarksHandler}
                className="bg-green-600 text-white px-8 py-3 rounded shadow hover:bg-green-700 transition"
              >
                Upload Student Marks
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marks;
