import React, { useState, useEffect, useCallback } from 'react';
import './SystemResourceMonitor.css';

function SystemResourceMonitor({ theme }) {
  const [resources, setResources] = useState({
    memory: {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0,
      usedPercentage: 0
    },
    performance: {
      domContentLoaded: 0,
      loadComplete: 0,
      fps: 0
    },
    connection: {
      effectiveType: 'Unknown',
      downlink: 0,
      rtt: 0
    }
  });

  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastFrameTime, setLastFrameTime] = useState(performance.now());
  const [frameCount, setFrameCount] = useState(0);

  // Format bytes to readable format
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Calculate FPS
  const calculateFPS = useCallback(() => {
    const now = performance.now();
    const delta = now - lastFrameTime;
    
    if (delta >= 1000) {
      const fps = Math.round((frameCount * 1000) / delta);
      setResources(prev => ({
        ...prev,
        performance: { ...prev.performance, fps }
      }));
      setLastFrameTime(now);
      setFrameCount(0);
    } else {
      setFrameCount(prev => prev + 1);
    }
  }, [frameCount, lastFrameTime]);

  // Update resource metrics
  const updateResources = useCallback(() => {
    if (!isMonitoring) return;

    // Memory information
    if (performance.memory) {
      const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
      const usedPercentage = Math.round((usedJSHeapSize / jsHeapSizeLimit) * 100);

      setResources(prev => ({
        ...prev,
        memory: {
          usedJSHeapSize,
          totalJSHeapSize,
          jsHeapSizeLimit,
          usedPercentage
        }
      }));
    }

    // Performance timing
    if (performance.timing) {
      const { domContentLoadedEventEnd, navigationStart, loadEventEnd } = performance.timing;
      const domContentLoaded = domContentLoadedEventEnd - navigationStart;
      const loadComplete = loadEventEnd - navigationStart;

      setResources(prev => ({
        ...prev,
        performance: {
          ...prev.performance,
          domContentLoaded,
          loadComplete
        }
      }));
    }

    // Network information
    if (navigator.connection) {
      const { effectiveType, downlink, rtt } = navigator.connection;
      setResources(prev => ({
        ...prev,
        connection: {
          effectiveType: effectiveType || 'Unknown',
          downlink: downlink || 0,
          rtt: rtt || 0
        }
      }));
    }
  }, [isMonitoring]);

  // FPS monitoring loop
  useEffect(() => {
    if (!isMonitoring) return;

    let animationFrameId;
    const fpsLoop = () => {
      calculateFPS();
      animationFrameId = requestAnimationFrame(fpsLoop);
    };
    
    fpsLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isMonitoring, calculateFPS]);

  // Resource monitoring interval
  useEffect(() => {
    if (!isMonitoring) return;

    updateResources();
    const interval = setInterval(updateResources, 1000);
    
    return () => clearInterval(interval);
  }, [isMonitoring, updateResources]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const getMemoryStatus = () => {
    const percentage = resources.memory.usedPercentage;
    if (percentage < 50) return 'good';
    if (percentage < 75) return 'warning';
    return 'critical';
  };

  const getFPSStatus = () => {
    const fps = resources.performance.fps;
    if (fps >= 50) return 'good';
    if (fps >= 30) return 'warning';
    return 'critical';
  };

  return (
    <div className={`system-monitor-container ${theme}-mode`}>
      <div className="monitor-header">
        <h2>System Resource Monitor</h2>
        <button 
          className={`monitor-toggle ${isMonitoring ? 'active' : ''}`}
          onClick={toggleMonitoring}
        >
          {isMonitoring ? '⏸ Pause' : '▶ Resume'}
        </button>
      </div>

      <div className="resource-grid">
        {/* Memory Usage Card */}
        <div className={`resource-card memory-card ${getMemoryStatus()}`}>
          <h3>💾 Memory Usage</h3>
          <div className="metric-row">
            <span className="metric-label">Used:</span>
            <span className="metric-value">
              {formatBytes(resources.memory.usedJSHeapSize)}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Total:</span>
            <span className="metric-value">
              {formatBytes(resources.memory.totalJSHeapSize)}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Limit:</span>
            <span className="metric-value">
              {formatBytes(resources.memory.jsHeapSizeLimit)}
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${resources.memory.usedPercentage}%` }}
            >
              <span className="progress-text">
                {resources.memory.usedPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Performance Card */}
        <div className={`resource-card performance-card ${getFPSStatus()}`}>
          <h3>⚡ Performance</h3>
          <div className="metric-row">
            <span className="metric-label">FPS:</span>
            <span className="metric-value fps-value">
              {resources.performance.fps}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">DOM Load:</span>
            <span className="metric-value">
              {resources.performance.domContentLoaded}ms
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Page Load:</span>
            <span className="metric-value">
              {resources.performance.loadComplete}ms
            </span>
          </div>
        </div>

        {/* Network Card */}
        <div className="resource-card network-card">
          <h3>🌐 Network</h3>
          <div className="metric-row">
            <span className="metric-label">Type:</span>
            <span className="metric-value">
              {resources.connection.effectiveType}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Downlink:</span>
            <span className="metric-value">
              {resources.connection.downlink} Mbps
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">RTT:</span>
            <span className="metric-value">
              {resources.connection.rtt}ms
            </span>
          </div>
        </div>
      </div>

      <div className="monitor-info">
        <p>ℹ️ This monitor tracks browser-level resources only. Memory values represent JavaScript heap usage.</p>
        {!performance.memory && (
          <p className="warning-text">⚠️ Memory API not available in this browser. Use Chrome/Edge for full metrics.</p>
        )}
      </div>
    </div>
  );
}

export default SystemResourceMonitor;