'use client';
import React from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState  } from 'react';
import { FtpResponse, FtpSettings, FtpStatus } from "@/helpers/ipc/ftp";
import { getFtpSettings, onFtpStatus, saveFtpSettings, connect, getAssetList } from "@/helpers/window_helpers";
import { useToast } from "@/components/hooks/use-toast"
import { DotIndicator } from "@/components/ui/dot-indicator";
import { GameTable} from "./game-table"
import { gameStore } from "@/lib/store";

const DEFAULT_IP = '192.168.1.';

export default function FTPAssets() {
    const [status, setStatus] = useState<FtpStatus>('disconnected');
    const [settings, setSettings] = useState<FtpSettings>(
        { ip: '', user: '', pass: '', port: '' }
    );
    const { toast } = useToast()


    const handleValueChange = (key: string, value: string) => {
        setSettings({ ...settings, [key]: value });
    }

    function isFtpResponse(message: unknown): message is FtpResponse {
    return (
        typeof message === 'object' &&
        message !== null &&
        'status' in message &&
        typeof (message as FtpResponse).status === 'string'
    );
}

    useEffect(() => {
        // Load saved settings
        getFtpSettings().then((settings) => {
            setSettings(settings);
            if (settings.ip !== DEFAULT_IP && status === 'disconnected') {
                connect(settings.ip, settings.user, settings.pass, settings.port)
            }
        });

        // // Setup status listener
        const unsubscribe = onFtpStatus((message: FtpResponse|unknown) => {
            if (isFtpResponse(message)) {
                setStatus(message.status);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (status === 'error') {
            toast({
                title: "Connection Error",
                description: "An error occurred while connecting",
                variant: "destructive"
            });
        }
    }, [status]);

    const testConnection = () => {
        connect(settings.ip, settings.user, settings.pass, settings.port).then((result) => {
            toast({
              title: "Connection Test",
              description: result ? "Connection successful" : "Connection failed",
              variant: result ? "default" : "destructive"
            })
        });
    }

    const saveSettings = () => {
        saveFtpSettings(settings.ip, settings.user, settings.pass, settings.port).then(() => {
            toast({
              title: "Settings saved",
              description: "Settings have been saved successfully",
            })
        });
    }

    const getAssets = () => {
        getAssetList().then((assets) => {
            gameStore.setState({ games: assets });
        });
    }

    return (
        <>
          {/* Settings Box */}
          <div className="border p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            {/* Status */}
            <div className="flex gap-4">
              <span>Status:</span>
              <DotIndicator status={status} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label>IP Address:</label>
                <Input placeholder="192.168.1." value={settings.ip}
                onChange={(e) => handleValueChange('ip', e.target.value)}/>
              </div>
              <div className="space-y-2">
                <label>Port:</label>
                <Input placeholder="21" value={settings.port}
                onChange={(e) => handleValueChange('port', e.target.value)}/>
              </div>
              <div className="space-y-2">
                <label>Username:</label>
                <Input placeholder="xboxftp" value={settings.user}
                onChange={(e) => handleValueChange('user', e.target.value)}/>
              </div>
              <div className="space-y-2">
                <label>Password:</label>
                <Input type="password" placeholder="xboxftp" value={settings.pass}
                onChange={(e) => handleValueChange('pass', e.target.value)}/>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <Button
                onClick={testConnection}
              >
                  Connect
              </Button>
              <Button
                onClick={saveSettings}
              >Save Settings</Button>
              <Button className="ml-auto"
                disabled={status !== 'online'}
                onClick={getAssets}
              >Get Available Assets</Button>
            </div>
          </div>

          <GameTable />
          </>
    );
}

