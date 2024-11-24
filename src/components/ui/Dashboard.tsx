import React from 'react';
import { Mail, Calendar, Car, Home, Network, Settings, Plus } from 'lucide-react';
import { Widget } from './Widget';
import { useAmeliaStore } from '../../lib/store/useAmeliaStore';

export const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your overview.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Widget
          title="Email"
          icon={<Mail className="w-5 h-5" />}
          loading={false}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Unread</span>
              <span className="text-sm font-bold text-blue-600">3</span>
            </div>
            <div className="space-y-2">
              {['Meeting Follow-up', 'Project Update', 'Team Sync'].map((email, i) => (
                <div key={i} className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-gray-700">{email}</span>
                </div>
              ))}
            </div>
          </div>
        </Widget>

        <Widget
          title="Calendar"
          icon={<Calendar className="w-5 h-5" />}
          loading={false}
        >
          <div className="space-y-3">
            {[
              { time: '10:00 AM', event: 'Team Meeting' },
              { time: '2:00 PM', event: 'Client Call' },
              { time: '4:30 PM', event: 'Project Review' },
            ].map((event, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-500">{event.time}</div>
                <div className="text-sm text-gray-700">{event.event}</div>
              </div>
            ))}
          </div>
        </Widget>

        <Widget
          title="Smart Home"
          icon={<Home className="w-5 h-5" />}
          loading={false}
        >
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Living Room', status: 'On', temp: '72°F' },
              { name: 'Kitchen', status: 'Off', temp: '70°F' },
              { name: 'Bedroom', status: 'On', temp: '71°F' },
              { name: 'Office', status: 'Off', temp: '69°F' },
            ].map((room, i) => (
              <div key={i} className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-700">{room.name}</div>
                <div className="mt-1 flex justify-between items-center">
                  <span className={`text-xs ${
                    room.status === 'On' ? 'text-green-500' : 'text-gray-400'
                  }`}>
                    {room.status}
                  </span>
                  <span className="text-xs text-gray-500">{room.temp}</span>
                </div>
              </div>
            ))}
          </div>
        </Widget>

        <Widget
          title="Tesla"
          icon={<Car className="w-5 h-5" />}
          loading={false}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Battery</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-green-500" />
                </div>
                <span className="text-sm text-gray-700">80%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Range</span>
              <span className="text-sm text-gray-700">245 miles</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Location</span>
              <span className="text-sm text-gray-700">Home</span>
            </div>
          </div>
        </Widget>

        <Widget
          title="Network"
          icon={<Network className="w-5 h-5" />}
          loading={false}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Devices</span>
              <span className="text-sm text-gray-700">12 Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Download</span>
              <span className="text-sm text-gray-700">450 Mbps</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Upload</span>
              <span className="text-sm text-gray-700">380 Mbps</span>
            </div>
          </div>
        </Widget>

        <button
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors flex flex-col items-center justify-center space-y-2"
          aria-label="Add new widget"
        >
          <Plus className="w-8 h-8 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Add Widget</span>
        </button>
      </div>
    </div>
  );
};