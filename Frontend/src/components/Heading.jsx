import React from 'react'

const Heading = (props) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="font-semibold text-3xl border-l-8 border-red-500 pl-3"  >
        {props.title}
      </div>
    </div>
  );
};

export default Heading
