import React, { useState } from 'react';
import { PulseHome } from './PulseHome';
import { PulseChannel } from './PulseChannel';

export const PulsePage = () => {
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  return (
    <div>
      {selectedChannelId ? (
        <PulseChannel
          channelId={selectedChannelId}
          onBack={() => setSelectedChannelId(null)}
        />
      ) : (
        <PulseHome onSelectChannel={(id) => setSelectedChannelId(id)} />
      )}
    </div>
  );
};
