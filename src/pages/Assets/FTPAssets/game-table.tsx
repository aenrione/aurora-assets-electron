import React from 'react';
import { DataTable } from '@/components/data-table/table';
import { Hand, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gameStore } from '@/lib/store';

const columns = [
  {
    id: 'title',
    header: 'Title',
    accessorKey: 'name',
    noFilter: true,
  },
  {
    id: 'databaseId',
    header: 'DatabaseID',
    accessorKey: 'databaseId',
    noFilter: true,
  },
  {
    id: 'titleId',
    header: 'TitleID',
    accessorKey: 'titleId',
    noFilter: true,
  },
  {
    id: 'mediaId',
    header: 'MediaID',
    accessorKey: 'mediaId',
    noFilter: true,
  },
  {
    id: 'dis',
    header: 'Disk',
    accessorKey: 'dis',
    noFilter: true,
  },
  {
    id: 'action',
    header: 'Action',
    noFilter: true,
    cell({row: game}: {row: any}) {
      return (
        <RowActions row={game} />
      );
    }
  }
];

function RowActions({ row }: { row: any }) {
  const currentGame = gameStore((state) => state.currentGame);
  const setCurrentGame = gameStore((state) => state.setCurrentGame);
  const clearCurrentGame = gameStore((state) => state.clearCurrentGame);

  const isSameGame = currentGame.titleId === row.original.titleId;

  const handleButtonClick = () => {
    if (isSameGame) {
      clearCurrentGame();
    } else {
      setCurrentGame(row.original);
    }
  };

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={handleButtonClick}>
        {!isSameGame ? <Hand size={16} /> : <XCircle size={16} />}
      </Button>
    </div>
  );
}


export function GameTable() {
  const games = gameStore((state) => state.games);
  return(
    <div className="h-[500px] overflow-y-auto">
      <DataTable columns={columns} data={games} 
      />
    </div>
  )
}
