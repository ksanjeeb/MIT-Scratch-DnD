import { useState } from "react";
import { PackagePlus } from "lucide-react";
import BlockComponent from "../sharedComponent/BlockComponent";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";

const blockData = [
    { type: "move", category: "motion", initialValue: { x: 10, y: 0 } },
    { type: "clockwise", category: "motion", initialValue: { x: 0, y: 0, rotation: 15 } },
    { type: "anticlockwise", category: "motion", initialValue: { x: 10, y: 10, rotation: 15 } },
    { type: "go_to", category: "motion", initialValue: { delay: 1, x: 10, y: 10, rotation: 15, message: "", size: 0 } },
    { type: "glide", category: "motion", initialValue: { size: 0, delay: 1, x: 10, y: 10, rotation: 15 }, onAction: "consoleLog" },
    { type: "random", category: "motion", initialValue: { x: 0, y: 0 } },
    { type: "mouse_pointer", category: "motion", initialValue: {} },
    { type: "say_for_seconds", category: "looks", initialValue: { size: 0, delay: 1, message: "Hello" } },
    { type: "say", category: "looks", initialValue: { delay: 1, rotation: 0, size: 0, message: "Hello" } },
    { type: "change_size", category: "looks", initialValue: { x: 0, y: 0, delay: 0, rotation: 0, size: 2, message: "" } },
    { type: "flag_clicked", category: "events", initialValue: {} },
    { type: "space_clicked", category: "events", initialValue: {} },
    { type: "sprite_clicked", category: "events", initialValue: {} },
];

function Playground() {
    const [groups, setGroups] = useState([{ items: [] }]);
    const [initialBlock, setInitialBlock] = useState(blockData);

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        const sourceGroupIndex = parseInt(source.droppableId.split('-')[1], 10);
        const destinationGroupIndex = parseInt(destination.droppableId.split('-')[1], 10);

        if (source.droppableId === destination.droppableId) {
            // Reorder within the same group
            const items = Array.from(groups[sourceGroupIndex]?.items || []);
            const [movedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, movedItem);

            const newGroups = [...groups];
            newGroups[sourceGroupIndex] = { items };
            setGroups(newGroups);
        } else {
            // Move between different groups
            const sourceItems = Array.from(groups[sourceGroupIndex]?.items || []);
            const [movedItem] = sourceItems.splice(source.index, 1);

            const destinationItems = Array.from(groups[destinationGroupIndex]?.items || []);
            destinationItems.splice(destination.index, 0, movedItem);

            const newGroups = [...groups];
            newGroups[sourceGroupIndex] = { items: sourceItems };
            newGroups[destinationGroupIndex] = { items: destinationItems };
            setGroups(newGroups);
        }
    };

    const handleChangeAction = ({ type, values }) => {
        const updatedGroups = groups.map(group => ({
            ...group,
            items: group.items.map(item => 
                item.type === type ? { ...item, ...values } : item
            )
        }));
        setGroups(updatedGroups);
    };

    return (
        <div className="p-4 w-full">
            <div className="flex flex-row justify-between mr-4">
                <div className="h-12 w-28 flex items-center self-center">
                    <img src="/scratch.png" alt="Scratch Logo" className="h-full w-full object-contain" />
                </div>
                <div
                    className="self-center cursor-pointer border-1 rounded-md p-1 text-white flex flex-row gap-2 border-white"
                    onClick={() => setGroups([...groups, { items: [] }])}
                >
                    Add Group
                    <PackagePlus color="white" />
                </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-row gap-4 mt-6">
                    <Droppable droppableId="draggableItems" isDropDisabled={true}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="draggable_container"
                            >
                                {initialBlock.map((block, index) => (
                                    <Draggable
                                        key={block.type}
                                        draggableId={block.type}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <BlockComponent
                                                    type={block.type}
                                                    category={block.category}
                                                    initialValue={block.initialValue || {}}
                                                    onAction={handleChangeAction}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    <div className="flex flex-col gap-2 mt-6 w-full mx-4">
                        {groups.map((group, groupIndex) => (
                            <Droppable
                                key={groupIndex}
                                droppableId={`droppableGroup-${groupIndex}`}
                            >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="bg-neutral-700 w-full p-4 min-h-44 rounded-md droppable_area"
                                    >
                                        {group.items.length === 0 && <p className="font-bold text-xl text-white">Place block here</p>}
                                        {group.items.map((item, index) => (
                                            <Draggable
                                                key={`${item.type}-${index}`}
                                                draggableId={`${item.type}-${index}`}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <BlockComponent
                                                            type={item.type}
                                                            category={item.category}
                                                            initialValue={item.initialValue || {}}
                                                            onAction={handleChangeAction}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
}

export default Playground;
