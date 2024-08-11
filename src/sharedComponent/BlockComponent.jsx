/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Flag, GripHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';

function BlockComponent({ type, category, initialValue, onAction }) {
    const [values, setValues] = useState(initialValue);

    const handleInputChange = ({ target: { name, value } }) => {
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (typeof onAction === "function") onAction({  type: type, values: values })
    }, [values])

    const renderBlockContent = () => {
        const inputProps = {
            type: 'number',
            onChange: handleInputChange,
            className: 'w-14 rounded pl-2',
        };

        const textInputProps = {
            type: 'text',
            onChange: handleInputChange,
            className: 'w-16 rounded pl-2',
        };

        switch (type) {
            case 'move':
                return (
                    <div className="flex items-center space-x-2">
                        <span className='text-gray-300 font-semibold'>move</span>
                        <input name="x" value={values.x} {...inputProps} />
                        <span className='text-gray-300 font-semibold'>steps</span>
                    </div>
                );
            case 'clockwise':
            case 'anticlockwise':
                return (
                    <div className="flex items-center space-x-2">
                        <span className='text-gray-300 font-semibold'>turn {type === 'clockwise' ? '⟳' : '⟲'}</span>
                        <input name="rotation" value={values.rotation} {...inputProps} />
                        <span className='text-gray-300 font-semibold'>degrees</span>
                    </div>
                );
            case 'go_to':
                return (
                    <div className="flex items-center space-x-2">
                        <span className='text-gray-300 font-semibold'>go to x:</span>
                        <input name="x" value={values.x} {...inputProps} />
                        <span className='text-gray-300 font-semibold'>y:</span>
                        <input name="y" value={values.y} {...inputProps} />
                    </div>
                );
            case 'glide':
                return (
                    <div className="flex items-center space-x-2">
                        <span className='text-gray-300 font-semibold'>glide</span>
                        <input name="delay" value={values.delay} {...inputProps} className="w-12" />
                        <span className='text-gray-300 font-semibold'>secs to x:</span>
                        <input name="x" value={values.x} {...inputProps} />
                        <span className='text-gray-300 font-semibold'>y:</span>
                        <input name="y" value={values.y} {...inputProps} />
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
                        <input name="message" value={values.message} {...textInputProps} />
                        <span className='text-gray-300 font-semibold'>for</span>
                        <input name="delay" value={values.delay} {...inputProps} />
                        <span className='text-gray-300 font-semibold'>secs</span>
                    </div>
                );
            case 'say':
                return (
                    <div className="flex items-center space-x-2">
                        <span className='text-gray-300 font-semibold'>say</span>
                        <input name="message" value={values.message} {...textInputProps} />
                    </div>
                );
            case 'change_size':
                return (
                    <div className="flex items-center space-x-2">
                        <span className='text-gray-300 font-semibold'>change size by</span>
                        <input name="size" value={values.size} {...textInputProps} />
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
            className={`p-2 mb-4 ${returnColor()} text-sm rounded-lg shadow-lg w-fit flex flex-row gap-1`}
            // id={type}
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


BlockComponent.defaultProps = {
    initialValue: {
        x: 0,
        y: 0,
        delay: 0,
        rotation: 0,
        message: '',
        size: 0,
    },
};

export default BlockComponent;
