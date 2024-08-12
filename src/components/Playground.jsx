import { useContext, useEffect, useState } from "react";
import {  DeleteIcon,  PackagePlus } from "lucide-react";
import BlockComponent from "../sharedComponent/BlockComponent";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";
import { GlobalContext } from "../App";

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
    const { data, setData } = useContext(GlobalContext);

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) {
            const sourceGroupIndex = parseInt(source.droppableId.split('-')[1], 10);
            if (!isNaN(sourceGroupIndex)) {
                let newGroups = [...groups];
                newGroups[sourceGroupIndex].items.splice(source.index, 1);
                setGroups(newGroups);
            }
            return;
        }

        const sourceGroupIndex = parseInt(source.droppableId.split('-')[1], 10);
        const destinationGroupIndex = parseInt(destination.droppableId.split('-')[1], 10);


        let newGroup = [...groups];
        if (source.droppableId === destination.droppableId) {
            if (destination.index === 0) {
                const exist = newGroup[destinationGroupIndex].items.find(each => each.type === "flag_clicked" || each.type === "space_clicked" || each.type === "sprite_clicked")
                if (exist) {
                    return;
                }
            }
            const [movedItem] = newGroup[sourceGroupIndex].items.splice(source.index, 1);
            if (movedItem?.type === "flag_clicked" || movedItem?.type === "space_clicked" || movedItem?.type === "sprite_clicked") {
                newGroup[destinationGroupIndex].items.splice(0, 0, movedItem);
                return;
            }

            newGroup[destinationGroupIndex].items.splice(destination.index, 0, movedItem);

        } else {
            if (destination.index === 0) {
                const exist = newGroup[destinationGroupIndex].items.find(each => each.type === "flag_clicked" || each.type === "space_clicked" || each.type === "sprite_clicked")
                if (exist) {
                    alert("Already an action exist so please add it after that.")
                    return;
                }
            }
            if (!isNaN(sourceGroupIndex) && !isNaN(destinationGroupIndex)) {
                const blockDetails = newGroup[sourceGroupIndex]?.items?.[source?.index];
                if (blockDetails?.type === "flag_clicked" || blockDetails?.type === "space_clicked" || blockDetails?.type === "sprite_clicked") {
                    const exist = newGroup[destinationGroupIndex].items.find(each => each.type === "flag_clicked" || each.type === "space_clicked" || each.type === "sprite_clicked")
                    if (exist) {
                        alert("You cann't keep multiple action in the same group")
                        return;
                    } else {
                        newGroup[sourceGroupIndex]?.items.splice(source?.index, 1)
                        newGroup[destinationGroupIndex].items.splice(0, 0, blockDetails);
                        return;
                    }
                }
                newGroup[sourceGroupIndex]?.items.splice(source?.index, 1)
                newGroup[destinationGroupIndex].items.splice(destination.index, 0, blockDetails);
            } else {
                const blockDetails = blockData[source?.index]
                if (blockDetails?.type === "flag_clicked" || blockDetails?.type === "space_clicked" || blockDetails?.type === "sprite_clicked") {
                    const exist = newGroup[destinationGroupIndex].items.find(each => each.type === "flag_clicked" || each.type === "space_clicked" || each.type === "sprite_clicked")
                    if (exist) {
                        alert("You cann't keep multiple action in the same group")
                        return;
                    } else {
                        newGroup[destinationGroupIndex].items.splice(0, 0, blockDetails);
                        return;
                    }
                }
                newGroup[destinationGroupIndex].items.splice(destination.index, 0, blockDetails);
            }
        }

        setGroups(newGroup);
    };

    const handleClickAction = (event) => {
        const getClicked = blockData.find((each) => event === each.type)
        setData({ ...data, clicked: {...getClicked,click_id:Date.now().toString(16) }})
    }

    useEffect(() => {
        setData({ ...data, groups: groups })
    }, [groups])

    const handleDelete =(index)=>{
        let modifiedGroup = [...groups];
        modifiedGroup.splice(index,1);
        setGroups(modifiedGroup)
    }


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
                                {blockData.map((block, index) => (
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
                                                    onClickAction={handleClickAction}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    <div className="flex flex-col gap-4 mt-6 w-full mx-4 overflow-y-auto h-[calc(100vh_-_10rem)]">
                        {groups.map((group, groupIndex) => (
                            <Droppable
                                key={groupIndex}
                                droppableId={`droppableGroup-${groupIndex}`}
                            >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="bg-neutral-700 w-full flex flex-col  p-4 rounded-md droppable_area"
                                    >
                                        {groupIndex > 0 && <div className="self-end cursor-pointer" onClick={()=>handleDelete(groupIndex)} title="Delete this group"><DeleteIcon  color="red"/></div>}
                                        {group.items.length === 0 && <p className="font-semibold p-44 text-lg text-gray-400">Place block here</p>}

                                        {group.items.map((item, index) => (
                                            <Draggable
                                                key={`${item.type}-${index}`}
                                                draggableId={`${item.type}-${groupIndex}-${index}`}
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
                                                            onClickAction={handleClickAction}
                                                        />
                                                        {provided.placeholder}

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
