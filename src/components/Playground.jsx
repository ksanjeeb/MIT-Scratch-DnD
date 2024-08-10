import { PackagePlus } from "lucide-react";
import { Droppable } from "react-beautiful-dnd";
import BlockComponent from "../sharedComponent/BlockComponent";

function Playground({ ...props }) {

    const initialValues = {
        x: 10,
        y: 20,
        delay: 5,
        rotation: 90,
        message: 'Hello!',
        size: 50,
    };

    return (
        <div className="p-4 w-full">
            <div className="flex flex-row justify-between mr-4">
                <div className='h-12 w-28 flex items-center self-center'>
                    <img src='/scratch.png' alt="Scratch Logo" className='h-full w-full object-contain' />
                </div>
                <div className="self-center cursor-pointer border-1 rounded-md p-1 text-white flex flex-row gap-2 border-white">
                    Add Group
                    <PackagePlus color="white" />
                </div>
            </div>
            <div className="flex flex-row gap-2">
                <div id="draggable_container">
                    <BlockComponent
                        type="move"
                        category="motion"
                        id={Date.now().toString(16)}
                        initialValue={{ ...initialValues, y: 0 }} // Customize values as needed
                    />
                    <BlockComponent
                        type="clockwise"
                        category="motion"
                        id={Date.now().toString(16)}

                        initialValue={{ ...initialValues, x: 0, y: 0 }} // Customize values as needed
                    />
                    <BlockComponent
                        type="anticlockwise"
                        category="motion"
                        id={Date.now().toString(16)}

                        initialValue={{ ...initialValues, x: 0, y: 0 }} // Customize values as needed
                    />
                    <BlockComponent
                        type="go_to"
                        category="motion"
                        id={Date.now().toString(16)}

                        initialValue={{ ...initialValues, delay: 0, rotation: 0, message: '', size: 0 }}
                    />
                    <BlockComponent
                        type="glide"
                        category="motion"
                        id={Date.now().toString(16)}
                        initialValue={{ ...initialValues, size: 0 }}
                        onAction={(event) => console.log(event)}
                    />
                    <BlockComponent
                        type="random"
                        id={Date.now().toString(16)}
                        category="motion"
                    />
                    <BlockComponent
                        type="mouse_pointer"
                        id={Date.now().toString(16)}

                        category="motion"
                    />
                    <BlockComponent
                        type="say_for_seconds"
                        category="looks"
                        id={Date.now().toString(16)}
                        initialValue={{ ...initialValues, size: 0 }} // Customize values as needed
                    />
                    <BlockComponent
                        type="say"
                        category="looks"
                        id={Date.now().toString(16)}

                        initialValue={{ ...initialValues, delay: 0, rotation: 0, size: 0 }} // Customize values as needed
                    />
                    <BlockComponent
                        type="change_size"
                        category="looks"
                        id={Date.now().toString(16)}

                        initialValue={{ ...initialValues, x: 0, y: 0, delay: 0, rotation: 0, message: '' }} // Customize values as needed
                    />
                    <BlockComponent
                        type="flag_clicked"
                        category="events"
                        id={Date.now().toString(16)}

                    />
                    <BlockComponent
                        type="space_clicked"
                        category="events"
                        id={Date.now().toString(16)}

                    />
                    <BlockComponent
                        type="sprite_clicked"
                        category="events"
                        id={Date.now().toString(16)}
                    />
                </div>
                <div id="droppable_container">
                    {[...Array(5)].map((el, index) => <Droppable droppableId={"block-list-" + index} key={index} className="border-2 border-black">
                        {(provided) => {
                            <div className="action-blocks " ref={provided.innerRef} {...provided.droppableProps}>

                            </div>
                        }
                        }
                    </Droppable>)
                    }

                </div>
            </div>
        </div>
    );
}

export default Playground;