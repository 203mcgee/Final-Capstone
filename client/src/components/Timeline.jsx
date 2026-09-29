import React, { Fragment } from 'react';

const Circle = () =>{
    return(
        <div className='bg-linear-to-r from-blue-500 to-teal-500 rounded-full w-4 h-4 bg-blue-500 mx-auto'>

        </div>
        // <div className='circle'></div>
    )
}
const Pillar = () =>{
    return(
        <div className='bg-linear-to-b from-blue-500 to-teal-500 rounded-t-full rounded-b-full w-2 h-full bg-blue-500 mx-auto'>

        </div>
    )
}
const EventCard = ({heading,date}) =>{
    return(
        <div className='bg-white transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl flex flex-col gap-y-2 border shadow-md rounded-xl p-4'>
            <div className='text-blue-800 font-bold text-lg border-b '>{heading}</div>
            <div className='text-sm text-gray-700'>{date}</div>
        </div>
    )
}

const Timeline = ({info}) => {
    return(
        <div className='flex flex-col gap-y-3 w-full my-4'>
            <Circle/>
            {info.map((event,key)=>{
                const heading = event.skill || event.framework || event.techCheck;
                const date = event.learned || event.completion;
                {/* Wrap elements in <Fragment> to group them together in situations where you need a single element. */}
               return <Fragment key={key}>
                    <div className='grid grid-cols-[1fr_auto_1fr] gap-x-2 items-center mx-auto'>
                        {event.direction === 'left' ? (
                            <EventCard heading={heading} date={date} />
                        ):(
                            <div></div>
                        )
                         }
                        <Pillar/>
                         {event.direction === 'right' ? (
                            <EventCard heading={heading} date={date} />
                        ):(
                            <div></div>
                        )
                         }
                    </div>
                    {key < (info.length - 1) && <Circle/>}
                </Fragment>
            })}
        </div>
    )
}

export default Timeline;