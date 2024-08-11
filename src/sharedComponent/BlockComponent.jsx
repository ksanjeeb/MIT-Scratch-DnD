/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Flag, GripHorizontal, Play } from 'lucide-react';
import { useEffect, useState } from 'react';

function BlockComponent({ type, category, initialValue, onAction , onClickAction}) {
    const [values] = useState(initialValue);

    // const handleInputChange = ({ target: { name, value } }) => {
    //     setValues((prevValues) => ({
    //         ...prevValues,
    //         [name]: value,
    //     }));
    // };

    useEffect(() => {
        if (typeof onAction === "function") onAction({ type: type, values: values })
    }, [values])

    const renderBlockContent = () => {
        switch (type) {
            case 'move':
                return (
                    <div className="flex items-center space-x-2">
                        <span className='text-gray-300 font-semibold'>move</span>
                        <div className='w-8 text-center font-bold'>{values.x}</div>
                        <span className='text-gray-300 font-semibold'>steps</span>
                    </div>
                );
            case 'clockwise':
            case 'anticlockwise':
                return (
                    <div className="flex items-center space-x-2">
                        <span className='text-gray-300 font-semibold'>turn {type === 'clockwise' ? '⟳' : '⟲'}</span>
                        <div className='w-8 text-center font-bold'>{values.rotation}</div>
                        <span className='text-gray-300 font-semibold'>degrees</span>
                    </div>
                );
            case 'go_to':
                return (
                    <div className="flex items-center space-x-2">
                        <span className='text-gray-300 font-semibold'>go to x:</span>
                        <div className='w-8 text-center font-bold'>{values.x}</div>
                        <span className='text-gray-300 font-semibold'>y:</span>
                        <div className='w-8 text-center font-bold'>{values.y}</div>
                    </div>
                );
            case 'glide':
                return (
                    <div className="flex items-center space-x-2">
                        <span className='text-gray-300 font-semibold'>glide</span>
                        <div className='w-12 text-center font-bold'>{values.delay}</div>
                        <span className='text-gray-300 font-semibold'>secs to x:</span>
                        <div className='w-8 text-center font-bold'>{values.x}</div>
                        <span className='text-gray-300 font-semibold'>y:</span>
                        <div className='w-8 text-center font-bold'>{values.y}</div>
                    </div>
                );
            case 'random':
                return (
                    <div className="flex items-center space-x-2">
                        <span className='text-gray-300 font-semibold'>go to random position</span>
                    </div>
                );
            case 'mouse_pointer':
                return (
                    <div className="flex items-center space-x-2">
                        <span className='text-gray-300 font-semibold'>points towards mouse</span>
                    </div>
                );
            case 'say_for_seconds':
                return (
                    <div className="flex items-center space-x-2">
                        <span className='text-gray-300 font-semibold'>say</span>
                        <div className='w-16 text-center font-bold'>{values.message}</div>
                        <span className='text-gray-300 font-semibold'>for</span>
                        <div className='w-8 text-center font-bold'>{values.delay}</div>
                        <span className='text-gray-300 font-semibold'>secs</span>
                    </div>
                );
            case 'say':
                return (
                    <div className="flex items-center space-x-2">
                        <span className='text-gray-300 font-semibold'>say</span>
                        <div className='w-16 text-center font-bold'>{values.message}</div>
                    </div>
                );
            case 'change_size':
                return (
                    <div className="flex items-center space-x-2">
                        <span className='text-gray-300 font-semibold'>change size by</span>
                        <div className='w-16 text-center font-bold'>{values.size}</div>
                    </div>
                );
            case 'flag_clicked':
                return (
                    <div className="flex items-center space-x-2 font-semibold">
                        when <Flag className='mx-2' fill='#00ff11' /> clicked
                    </div>
                );
            case 'space_clicked':
                return (
                    <div className="flex items-center space-x-2 font-semibold">
                        when space key clicked
                    </div>
                );
            case 'sprite_clicked':
                return (
                    <div className="flex items-center space-x-2 font-semibold">
                        when this sprite clicked
                    </div>
                );
            default:
                return <div></div>;
        }
    };

    const returnColor = () => {
        const colors = {
            motion: "bg-[#4d97fe]",
            looks: "bg-[#9966ff]",
            events: "bg-[#ffbf00]",
        };
        return colors[category] || 'bg-gray-500'; // Default color if category is unknown
    };

    return (
        <div
            className={`p-2 mb-4 ${returnColor()} text-sm rounded-lg shadow-lg w-fit flex flex-row gap-1 active:outline ring-offset-2 active:ring ring-blue-500`}
            // id={type}
            onClick={()=>onClickAction(type)}
        >
            <GripHorizontal
                size={20}
                color={category === "events" ? 'black' : 'white'}
                className="self-center"
            />
            {renderBlockContent()}
        
        </div>
    );
}


export default BlockComponent;