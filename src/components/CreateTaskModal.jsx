// src/components/CreateTaskModal.jsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'react-feather';

const CreateTaskModal = ({ isOpen, onClose, onSubmit, listId, taskToEdit = null }) => { // Adicionada taskToEdit prop
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Normal');
    // Não precisamos de 'status' no estado local do modal, pois ele é definido no TaskBoard

    useEffect(() => {
        if (isOpen) {
            if (taskToEdit) { // Se estamos editando, preenche os campos
                setTitle(taskToEdit.title || '');
                setDescription(taskToEdit.description || '');
                setDueDate(taskToEdit.dueDate || '');
                setPriority(taskToEdit.priority || 'Normal');
            } else { // Se estamos criando, limpa os campos
                setTitle('');
                setDescription('');
                setDueDate('');
                setPriority('Normal');
            }
        }
    }, [isOpen, taskToEdit]); // Re-executa quando taskToEdit muda também

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('O título da tarefa é obrigatório.');
            return;
        }
        // Os detalhes da tarefa, status não é modificado aqui, tags podem ser adicionadas no futuro
        const taskDetails = {
            title,
            description,
            dueDate,
            priority,
            // Mantém o status original se estiver editando, ou define como pendente se for nova.
            // A lógica de status já é tratada no TaskBoard/TaskCard para mudança simples.
            // Se quisermos editar status no modal, precisaríamos de um campo para isso.
            status: taskToEdit ? taskToEdit.status : 'Pendente',
            tags: taskToEdit ? taskToEdit.tags || [] : []
        };

        if (typeof onSubmit === 'function') {
            onSubmit(listId, taskDetails); // A lógica de ser create ou update é tratada no ListColumn
        } else {
            console.error('CreateTaskModal: Erro - props.onSubmit NÃO é uma função!');
        }
        // onClose(); // onClose será chamado pela função handleSubmitModal no ListColumn
    };

    const handleModalContentClick = (e) => e.stopPropagation();

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md text-gray-200 border border-slate-700"
                onClick={handleModalContentClick}
            >
                <div className="flex justify-between items-center mb-6">
                    {/* Título dinâmico do Modal */}
                    <h2 className="text-2xl font-semibold">{taskToEdit ? 'Editar Tarefa' : 'Criar Tarefa'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200 p-1 rounded-full hover:bg-slate-700">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="taskTitleModal" className="block text-sm font-medium text-gray-300 mb-1">Título:</label>
                        <input type="text" id="taskTitleModal" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-sky-500 focus:ring-sky-500 outline-none" required autoFocus />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="taskDescriptionModal" className="block text-sm font-medium text-gray-300 mb-1">Descrição:</label>
                        <textarea id="taskDescriptionModal" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-sky-500 focus:ring-sky-500 outline-none"></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="taskDueDateModal" className="block text-sm font-medium text-gray-300 mb-1">Data de Entrega:</label>
                        <input type="text" id="taskDueDateModal" value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="dd/mm/yy" className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-sky-500 focus:ring-sky-500 outline-none" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="taskPriorityModal" className="block text-sm font-medium text-gray-300 mb-1">Prioridade:</label>
                        <select id="taskPriorityModal" value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-sky-500 focus:ring-sky-500 outline-none appearance-none">
                            <option value="Baixa">Baixa</option>
                            <option value="Normal">Normal</option>
                            <option value="Média">Média</option>
                            <option value="Alta">Alta</option>
                        </select>
                    </div>
                    {/* Botão de submit dinâmico */}
                    <button type="submit" className={`w-full text-white font-semibold py-2.5 px-4 rounded-lg transition-colors ${taskToEdit ? 'bg-sky-600 hover:bg-sky-500' : 'bg-red-500 hover:bg-red-600'}`}>
                        {taskToEdit ? 'Salvar Alterações' : 'Criar Tarefa'}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
};
export default CreateTaskModal;