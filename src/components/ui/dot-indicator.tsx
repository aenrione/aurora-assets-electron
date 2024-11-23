// Create a dot indicator for online status component

import React from 'react';
import { cn } from '@/lib/utils';
import { FtpStatus } from '@/helpers/ipc/ftp';

interface DotIndicatorProps {
  status: FtpStatus;
}

const getColor = (status: FtpStatus) => {
    switch (status) {
        case 'online':
        return 'bg-green-500';
        case 'online':
        return 'bg-yellow-500';
        case 'disconnected':
        return 'bg-red-500';
        case 'error':
        return 'bg-red-700';
    }
    }

export const DotIndicator: React.FC<DotIndicatorProps> = ({ status }) => {
  return (
      <div className='flex items-center'>
    <div
      className={cn(
        'w-3 h-3 rounded-full',
        getColor(status),
      )}
    />
    <p className='ml-2 text-m'>({status})</p>
    </div>
  );
};


