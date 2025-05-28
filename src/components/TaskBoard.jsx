// src/components/TaskBoard.jsx
import React, { useState, useEffect } from 'react';
import AddList from './AddList';
import ListColumn from './ListColumn';
import PinnedListsArea from './PinnedListsArea';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const initialRegularListsData = [
    { id: `list-initreg-${Date.now().toString()}-1`, title: 'Tarefas Iniciais', cards: [] }
];
const initialPinnedListsData = [];

// Constantes para o padding do rodapé (relacionado à PinnedListsArea)
const PINNED_AREA_HEADER_HEIGHT_APPROX = 60;
const PINNED_AREA_COLLAPSED_RESERVED_HEIGHT_FOR_PADDING = PINNED_AREA_HEADER_HEIGHT_APPROX + 24; // Buffer

export default function TaskBoard({ currentSearchTerm, currentActiveFilters, sidebarCollapsed }) {
    const [regularLists, setRegularLists] = useState(() => {
        const savedRegular = localStorage.getItem('taskMasterRegularLists');
        if (savedRegular && savedRegular !== "undefined") {
            try { const parsed = JSON.parse(savedRegular); return Array.isArray(parsed) ? parsed : initialRegularListsData; }
            catch (error) { console.error("TaskBoard: Erro localStorage regularLists:", error); return initialRegularListsData; }
        }
        return initialRegularListsData;
    });

    const [pinnedLists, setPinnedLists] = useState(() => {
        const savedPinned = localStorage.getItem('taskMasterPinnedLists');
        if (savedPinned && savedPinned !== "undefined") {
            try { const parsed = JSON.parse(savedPinned); return Array.isArray(parsed) ? parsed : initialPinnedListsData; }
            catch (error) { console.error("TaskBoard: Erro localStorage pinnedLists:", error); return initialPinnedListsData; }
        }
        return initialPinnedListsData;
    });

    useEffect(() => {
        if (Array.isArray(regularLists)) localStorage.setItem('taskMasterRegularLists', JSON.stringify(regularLists));
        if (Array.isArray(pinnedLists)) localStorage.setItem('taskMasterPinnedLists', JSON.stringify(pinnedLists));
        console.log('%cTaskBoard: useEffect - "regularLists" ATUALIZADO:', 'color: blue; font-weight: bold;', JSON.parse(JSON.stringify(regularLists)));
        console.log('%cTaskBoard: useEffect - "pinnedLists" ATUALIZADO:', 'color: purple; font-weight: bold;', JSON.parse(JSON.stringify(pinnedLists)));
    }, [regularLists, pinnedLists]);

    const [isPinnedAreaCollapsed, setIsPinnedAreaCollapsed] = useState(false);

    const togglePinnedAreaCollapse = () => {
        setIsPinnedAreaCollapsed(prevState => !prevState);
    };

    // --- HANDLERS ---
    const handleAddList = (listTitle) => {
        console.log('TaskBoard: handleAddList >>>>> FOI CHAMADO COM TÍTULO:', listTitle);
        if (!listTitle.trim()) {
            console.log('TaskBoard: handleAddList - título vazio, retornando.');
            return;
        }
        const newList = { id: `list-${Date.now().toString()}`, title: listTitle, cards: [] };
        setRegularLists(prevLists => {
            const current = Array.isArray(prevLists) ? prevLists : [];
            return [...current, newList];
        });
    };

    const helperFindListAndModify = (listId, listsArray, modificationCallback) => {
        if (!Array.isArray(listsArray)) return [];
        return listsArray.map(list => list.id === listId ? modificationCallback(list) : list);
    };

    const handleDeleteList = (listId) => {
        console.log('TaskBoard: handleDeleteList chamado com listId:', listId);
        setRegularLists(prev => (Array.isArray(prev) ? prev : []).filter(list => list.id !== listId));
        setPinnedLists(prev => (Array.isArray(prev) ? prev : []).filter(list => list.id !== listId));
    };

    const handleAddCard = (listId, taskData) => {
        console.log('TaskBoard: handleAddCard chamado com:', { listId, taskData });
        if (!taskData || !taskData.title || !taskData.title.trim()) {
            console.error("TaskBoard: handleAddCard - Título inválido."); return;
        }
        const newCard = { id: `card-${Date.now().toString()}`, ...taskData }; // status já vem de taskData
        const addCardToListFn = list => ({ ...list, cards: [...(Array.isArray(list.cards) ? list.cards : []), newCard] });
        if (pinnedLists.some(l => l.id === listId)) {
            setPinnedLists(prev => helperFindListAndModify(listId, prev, addCardToListFn));
        } else {
            setRegularLists(prev => helperFindListAndModify(listId, prev, addCardToListFn));
        }
    };

    const handleDeleteCard = (listId, cardId) => {
        console.log('TaskBoard: handleDeleteCard chamado com:', { listId, cardId });
        const deleteCardFromListFn = list => ({ ...list, cards: (Array.isArray(list.cards) ? list.cards : []).filter(card => card.id !== cardId) });
        if (pinnedLists.some(l => l.id === listId)) {
            setPinnedLists(prev => helperFindListAndModify(listId, prev, deleteCardFromListFn));
        } else {
            setRegularLists(prev => helperFindListAndModify(listId, prev, deleteCardFromListFn));
        }
    };

    const handleUpdateTaskStatus = (listId, cardId, newStatus) => {
        console.log('TaskBoard: handleUpdateTaskStatus com:', { listId, cardId, newStatus });
        const updateStatusFn = list => ({ ...list, cards: (Array.isArray(list.cards) ? list.cards : []).map(c => c.id === cardId ? { ...c, status: newStatus } : c) });
        if (pinnedLists.some(l => l.id === listId)) {
            setPinnedLists(prev => helperFindListAndModify(listId, prev, updateStatusFn));
        } else {
            setRegularLists(prev => helperFindListAndModify(listId, prev, updateStatusFn));
        }
    };

    const handleUpdateCard = (listId, cardId, updatedData) => {
        console.log('TaskBoard: handleUpdateCard chamado com:', { listId, cardId, updatedData });
        const updateCardInListFn = (list) => {
            if (!Array.isArray(list.cards)) return list;
            return {
                ...list,
                cards: list.cards.map(card =>
                    card.id === cardId
                        ? { ...card, ...updatedData } // Mescla dados antigos com os novos, mantendo o status se não foi alterado no modal
                        : card
                )
            };
        };
        const isPinned = pinnedLists.some(l => l.id === listId);
        if (isPinned) {
            setPinnedLists(prevPinned => helperFindListAndModify(listId, prevPinned, updateCardInListFn));
        } else {
            setRegularLists(prevRegular => helperFindListAndModify(listId, prevRegular, updateCardInListFn));
        }
    };

    const onDragEnd = (result) => {
        console.log('TaskBoard: onDragEnd disparado', result);
        const { source, destination, type } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        let newRegularLists = Array.isArray(regularLists) ? [...regularLists] : [];
        let newPinnedLists = Array.isArray(pinnedLists) ? [...pinnedLists] : [];

        if (type === 'COLUMN') {
            let itemToMove;
            const sourceIsPinned = source.droppableId === 'pinned-lists-area';
            const destinationIsPinned = destination.droppableId === 'pinned-lists-area';

            if (sourceIsPinned) {
                [itemToMove] = newPinnedLists.splice(source.index, 1);
            } else {
                [itemToMove] = newRegularLists.splice(source.index, 1);
            }
            if (!itemToMove) return;

            if (destinationIsPinned) {
                if (newPinnedLists.length >= 3 && !sourceIsPinned) {
                    console.warn("TaskBoard: Área de fixados cheia (máx 3).");
                    return; // Não atualiza os estados, efetivamente cancelando o movimento
                }
                newPinnedLists.splice(destination.index, 0, itemToMove);
            } else {
                newRegularLists.splice(destination.index, 0, itemToMove);
            }
            setRegularLists(newRegularLists);
            setPinnedLists(newPinnedLists);
            return;
        }

        if (type === 'CARD') {
            const sListId = source.droppableId;
            const dListId = destination.droppableId;

            const sListIsPinned = newPinnedLists.some(l => l.id === sListId);
            const dListIsPinned = newPinnedLists.some(l => l.id === dListId);

            let sListArrayCopy = sListIsPinned ? newPinnedLists : newRegularLists;
            let dListArrayCopy = dListIsPinned ? newPinnedLists : newRegularLists;

            const sListIndex = sListArrayCopy.findIndex(l => l.id === sListId);
            const dListIndex = dListArrayCopy.findIndex(l => l.id === dListId);

            if (sListIndex === -1 || dListIndex === -1) return;

            const sourceList = { ...sListArrayCopy[sListIndex] };
            if (!Array.isArray(sourceList.cards)) sourceList.cards = [];
            const sourceCards = Array.from(sourceList.cards);
            const [movedCard] = sourceCards.splice(source.index, 1);
            sourceList.cards = sourceCards;
            sListArrayCopy[sListIndex] = sourceList;

            if (sListId === dListId) { // Reordenar na mesma lista
                const destCards = Array.from(sourceList.cards); // Já foi modificada acima
                destCards.splice(destination.index, 0, movedCard);
                sourceList.cards = destCards;
                sListArrayCopy[sListIndex] = sourceList; // Atualiza a lista no array copiado
            } else { // Mover para lista diferente
                const destList = { ...dListArrayCopy[dListIndex] };
                if (!Array.isArray(destList.cards)) destList.cards = [];
                const destCards = Array.from(destList.cards);
                destCards.splice(destination.index, 0, movedCard);
                destList.cards = destCards;
                dListArrayCopy[dListIndex] = destList; // Atualiza a lista no array copiado
            }

            setRegularLists(newRegularLists);
            setPinnedLists(newPinnedLists);
        }
    };

    const getFilteredListsLogic = (listsToFilter, term, filters) => {
        const currentLists = Array.isArray(listsToFilter) ? listsToFilter : [];
        const searchTermToUse = (term || '').trim().toLowerCase();
        const activeFiltersToUse = filters || { status: null, priority: null };
        if (searchTermToUse === '' && !activeFiltersToUse.priority && !activeFiltersToUse.status) return currentLists;

        let filteredOutput = JSON.parse(JSON.stringify(currentLists));
        if (searchTermToUse !== '') {
            filteredOutput = filteredOutput.map(list => ({ ...list, cards: (Array.isArray(list.cards) ? list.cards : []).filter(card => card.title.toLowerCase().includes(searchTermToUse) || (card.description && card.description.toLowerCase().includes(searchTermToUse))) }));
        }
        if (activeFiltersToUse.priority) {
            filteredOutput = filteredOutput.map(list => ({ ...list, cards: (Array.isArray(list.cards) ? list.cards : []).filter(card => card.priority === activeFiltersToUse.priority) }));
        }
        if (activeFiltersToUse.status) {
            filteredOutput = filteredOutput.map(list => ({ ...list, cards: (Array.isArray(list.cards) ? list.cards : []).filter(card => card.status === activeFiltersToUse.status) }));
        }
        return filteredOutput;
    };

    const filteredRegularLists = getFilteredListsLogic(regularLists, currentSearchTerm, currentActiveFilters);
    const filteredPinnedLists = getFilteredListsLogic(pinnedLists, currentSearchTerm, currentActiveFilters);
    const displayedPinnedLists = filteredPinnedLists;
    let displayedRegularLists = filteredRegularLists;

    if ((currentSearchTerm || '').trim().toLowerCase() !== '') {
        const matching = []; const nonMatching = [];
        (Array.isArray(regularLists) ? regularLists : []).forEach(originalList => {
            const hadOriginalSearchMatch = (Array.isArray(originalList.cards) ? originalList.cards : []).some(card => card.title.toLowerCase().includes((currentSearchTerm || '').trim().toLowerCase()) || (card.description && card.description.toLowerCase().includes((currentSearchTerm || '').trim().toLowerCase())));
            const listVersionForDisplay = filteredRegularLists.find(l => l.id === originalList.id);
            if (listVersionForDisplay) { if (hadOriginalSearchMatch) matching.push(listVersionForDisplay); else nonMatching.push(listVersionForDisplay); }
        });
        displayedRegularLists = [...matching, ...nonMatching];
    }

    const mainBoardPaddingBottom = `${PINNED_AREA_COLLAPSED_RESERVED_HEIGHT_FOR_PADDING}px`;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <PinnedListsArea
                pinnedLists={displayedPinnedLists}
                listProps={{
                    onDeleteList: handleDeleteList,
                    onAddCard: handleAddCard,
                    onDeleteCard: handleDeleteCard,
                    onUpdateTaskStatus: handleUpdateTaskStatus,
                    onUpdateCard: handleUpdateCard, // Passa a nova função
                    isPinnedContext: true
                }}
                sidebarCollapsed={sidebarCollapsed}
                isCollapsed={isPinnedAreaCollapsed}
                onToggleCollapse={togglePinnedAreaCollapse}
            />
            <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex space-x-4 p-4 overflow-x-auto h-full items-start"
                        style={{ paddingBottom: mainBoardPaddingBottom }}
                    >
                        {(Array.isArray(displayedRegularLists) ? displayedRegularLists : []).map((list, index) => (
                            <ListColumn
                                key={list.id}
                                list={list}
                                index={index}
                                onDeleteList={handleDeleteList}
                                onAddCard={handleAddCard}
                                onDeleteCard={handleDeleteCard}
                                onUpdateTaskStatus={handleUpdateTaskStatus}
                                onUpdateCard={handleUpdateCard} // Passa a nova função
                                isPinnedContext={false}
                            />
                        ))}
                        {provided.placeholder}
                        <div className="flex-shrink-0 w-72 self-start">
                            <AddList getlist={handleAddList} />
                        </div>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}