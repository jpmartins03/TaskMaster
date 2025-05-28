// src/components/ListColumn.jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal.jsx';
import { Trash2, Plus } from 'react-feather';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const ListColumn = ({ list, index, onDeleteList, onAddCard, onDeleteCard, onUpdateTaskStatus, onUpdateCard, isPinnedContext = false }) => { // Adicionada prop onUpdateCard
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null); // Estado para a tarefa em edição

    const handleOpenCreateModal = () => {
        setEditingTask(null); // Garante que não está em modo de edição
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (taskToEdit) => {
        setEditingTask(taskToEdit); // Define a tarefa para edição
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTask(null); // Limpa a tarefa em edição ao fechar
    };

    // Função unificada para submeter o modal (criar ou atualizar)
    const handleSubmitModal = (currentListId, taskDetails) => {
        if (editingTask) { // Se editingTask existe, é uma atualização
            if (typeof onUpdateCard === 'function') {
                onUpdateCard(currentListId, editingTask.id, taskDetails); // Passa ID da tarefa e os novos detalhes
            } else {
                console.error('ListColumn: props.onUpdateCard não é uma função!');
            }
        } else { // Caso contrário, é uma nova tarefa
            if (typeof onAddCard === 'function') {
                onAddCard(currentListId, taskDetails);
            } else {
                console.error('ListColumn: props.onAddCard não é uma função!');
            }
        }
        handleCloseModal(); // Fecha o modal e limpa editingTask
    };


    const columnContent = (dragProvided, dragSnapshot) => (
        <div
            {...dragProvided.draggableProps}
            ref={dragProvided.innerRef}
            className={`flex flex-col bg-slate-800/70 rounded-xl p-0 space-y-3 h-fit flex-shrink-0 w-72 shadow-lg border border-slate-700 ${dragSnapshot.isDragging ? 'ring-2 ring-sky-500 shadow-2xl opacity-95' : ''}`}
        >
            <div {...dragProvided.dragHandleProps} className="flex justify-between items-center p-4 pt-3 pb-1 rounded-t-xl cursor-grab hover:bg-slate-700/50">
                <h2 className="text-white text-lg font-semibold">{list.title}</h2>
                <button onClick={() => onDeleteList(list.id)} className="p-1 rounded hover:bg-red-600/70 text-gray-400 hover:text-white transition-colors" aria-label="Deletar lista">
                    <Trash2 size={18} />
                </button>
            </div>
            <Droppable droppableId={list.id.toString()} type="CARD">
                {(providedDroppable, snapshotDroppable) => (
                    <div
                        ref={providedDroppable.innerRef}
                        {...providedDroppable.droppableProps}
                        className={`space-y-3 overflow-y-auto ${isPinnedContext ? 'max-h-[110px]' : 'max-h-[calc(100vh-350px)]'} min-h-[60px] px-4 pb-1 custom-scrollbar rounded-b-md ${snapshotDroppable.isDraggingOver ? 'bg-slate-700/50' : 'bg-transparent'}`}
                    >
                        {(Array.isArray(list.cards) ? list.cards : []).map((card, cardIndex) => (
                            <TaskCard
                                key={card.id} task={card} index={cardIndex}
                                onDeleteTask={(taskId) => onDeleteCard(list.id, taskId)}
                                onUpdateStatus={(newStatus) => onUpdateTaskStatus(list.id, card.id, newStatus)}
                                onEditTask={handleOpenEditModal} // << Passa o handler para abrir em modo de edição
                            />
                        ))}
                        {providedDroppable.placeholder}
                    </div>
                )}
            </Droppable>
            <div className="p-4 pt-1">
                <button
                    onClick={handleOpenCreateModal} // Abre para criar nova tarefa
                    className="flex items-center justify-center p-2 w-full rounded-md mt-auto bg-slate-700/80 hover:bg-slate-600/90 text-gray-300 hover:text-white transition-colors"
                >
                    <Plus size={18} className="mr-2" /> Adicionar Tarefa
                </button>
            </div>
        </div>
    );

    return (
        <>
            <Draggable draggableId={list.id.toString()} index={index}>
                {(provided, snapshot) => {
                    const component = columnContent(provided, snapshot);
                    if (snapshot.isDragging) {
                        return ReactDOM.createPortal(component, document.body);
                    }
                    return component;
                }}
            </Draggable>
            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitModal} // Função unificada
                listId={list.id}
                taskToEdit={editingTask} // Passa a tarefa para edição (ou null se for criação)
            />
        </>
    );
};

export default ListColumn;