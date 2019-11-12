import React, { useState, useRef, useCallback, useEffect } from "react";
import { DragTypes } from "../../../lib/dragTypes";
import { useDrag, useDrop } from "react-dnd-cjs";
import { XYCoord } from "dnd-core-cjs";
import update from 'immutability-helper'

interface Props {
  id: string | number;
  text: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string | number;
  type: string;
  text: string;
}

export const Card: React.FC<Props> = ({ id, text, index, moveCard }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, connectDragSource] = useDrag({
    item: { type: DragTypes.CARD, id, index, text },
    end: (item) => {
      console.log(`Current item id ${id}`, index)
      console.log('Ended item: ', item)
      // Call when drag has ended
      // Check if item index has changed
      // Fire mutation event if so
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    }),
  });

  const [_, connectDropTarget] = useDrop({
    accept: DragTypes.CARD,
    canDrop: () => {
      return true
    },
    drop: (item: DragItem, monitor) => {
      console.log('-------------------DROPPED!---------------')
      console.log('ITEM: ', item)
      console.log('hoverIndex', index)
      console.log('-------------------DROPPED!---------------')
    },
    hover: (item: DragItem, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine imperative container;
      const hoverBoundingRect = ref.current!.getBoundingClientRect();
      // Get middle of y-axis in container;
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine current mouse position
      const clientOffset = monitor.getClientOffset();
      // Get offset pixels from current mouse position and container top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Move card!!!
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      dragIndex: monitor.getItem(),
      hoverIndex: index,
    })
  });

  connectDragSource(connectDropTarget(ref));
  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.2 : 1,
        border: "1px dashed gray",
        padding: "0.5rem 1rem",
        marginBottom: ".5rem",
        cursor: isDragging ? "grabbing" : "pointer",
        backgroundColor: "white",
        textAlign: "center",
        fontWeight: "bold"
      }}
    >
      {text}
    </div>
  );
};

export const DropLayout: React.FC = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      text: "First"
    },
    {
      id: 2,
      text: "Second"
    },
    {
      id: 3,
      text: "Third"
    },
    {
      id: 4,
      text: "Fourth"
    },
    {
      id: 5,
      text: "Fifth"
    }
  ]);

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = cards[dragIndex]
      setCards(
        update(cards, {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
        }),
      )
    },
    [cards]
  )

  return (
    <div>
      {cards.map((card, i) => (
        <Card id={card.id} key={card.id} text={card.text} index={i} moveCard={moveCard} />
      ))}
    </div>
  );
};

export const DropLayout2: React.FC = () => {
  const [cards, setCards] = useState([
    {
      id: 6,
      text: "Sixth"
    },
    {
      id: 7,
      text: "Seventh"
    },
    {
      id: 8,
      text: "Eighth"
    },
    {
      id: 9,
      text: "Ninth"
    },
    {
      id: 10,
      text: "Tenth"
    }
  ]);

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = cards[dragIndex]
      setCards(
        update(cards, {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
        }),
      )
    },
    [cards]
  )

  return (
    <div>
      {cards.map((card, i) => (
        <Card id={card.id} key={card.id} text={card.text} index={i} moveCard={moveCard} />
      ))}
    </div>
  );
}
