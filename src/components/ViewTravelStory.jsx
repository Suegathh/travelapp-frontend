import React from 'react';
import { GrMapLocation } from 'react-icons/gr';
import { MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md';
import moment from 'moment'

const ViewTravelStory = ({ storyInfo, onClose, onDeleteClick, onEditClick }) => {
    return (
        <div className='relative p-4'>
            <div className='flex items-center justify-end'>
                <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-lg'>
                    <button className='btn-small flex items-center gap-1'
                        onClick={onEditClick}>
                        <MdUpdate className='text-lg' /> Update Story
                    </button>

                    <button className='btn-small btn-delete flex items-center gap-1' onClick={onDeleteClick}>
                        <MdDeleteOutline className='text-lg' /> Delete
                    </button>

                    <button className='btn-small flex items-center gap-1' onClick={onClose}>
                        <MdClose className='text-lg text-slate-400' /> Close
                    </button>
                </div>
            </div>
            <div>
                <div className=''>
                    <h1 className='text-sm text-slate-950'>
                        {storyInfo && storyInfo.title}
                    </h1>

                    <div className='flex items-center justify-between gap-3'>
                        <span className='text-xs text-slate-500'>
                            {storyInfo && moment(storyInfo.visitDate).format("Do MM YYYY")}
                        </span>

                        <div className='inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1'>
                            <GrMapLocation className='text-sm' />
                            {storyInfo && storyInfo.visitedLocation.map((item, index) => storyInfo.visitedLocation.length == index + 1 ? `${item}`
                                : `${item}`)}
                        </div>
                    </div>
                </div>
                <img 
                    src={storyInfo && storyInfo.imageUrl} 
                    alt="Selected"
                    className='w-full h-[300px] object-cover rounded-lg' />

                    <div className='mt-4'>
                        <p className='text-sm text-slate-950 leading-6 text-justify whitespace-pre-line'>
                            {storyInfo.story}
                        </p>
                    </div>
            </div>
        </div>
    );
};



export default ViewTravelStory;
