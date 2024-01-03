/*
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

export const summaryListingFeatureKey = 'summary-listing';

export interface ClusterSummaryEntity {
    clustered: boolean;
    connectedNodeCount: number;
    connectedToCluster: boolean;
    totalNodeCount: number;
}
interface BaseSnapshot {
    bytesIn: number;
    bytesOut: number;
    flowFilesIn: number;
    flowFilesOut: number;
    id: string;
    input: string;
    name: string;
    output: string;
}

export interface BaseSnapshotEntity {
    canRead: boolean;
    id: string;
}

export interface ConnectionStatusSnapshot extends BaseSnapshot {
    bytesQueued: number;
    destinationName: string;
    flowFileAvailability: string;
    flowFilesQueued: number;
    groupId: string;
    percentUseCount: number;
    percentUseBytes: number;
    queued: string;
    queuedCount: string;
    queuedSize: string;
    sourceName: string;
}

export interface RemoteProcessGroupStatusSnapshot {
    activeThreadCount: number;
    bytesReceived: number;
    bytesSent: number;
    flowFilesReceived: number;
    flowFilesSent: number;
    groupId: string;
    id: string;
    name: string;
    received: string;
    sent: string;
    targetUri: string;
    transmissionStatus: string;
}

export interface ConnectionStatusSnapshotEntity extends BaseSnapshotEntity {
    connectionStatusSnapshot: ConnectionStatusSnapshot;
}

export interface RemoteProcessGroupStatusSnapshotEntity extends BaseSnapshotEntity {
    remoteProcessGroupStatusSnapshot: RemoteProcessGroupStatusSnapshot;
}

export interface ProcessorStatusSnapshot extends BaseSnapshot {
    activeThreadCount: number;
    bytesRead: number;
    bytesWritten: number;
    executionNode: string;
    groupId: string;
    read: string;
    runStatus: string;
    taskCount: number;
    tasks: string;
    tasksDuration: string;
    tasksDurationNanos: number;
    terminatedThreadCount: number;
    type: string;
    written: string;
    parentProcessGroupName: string;
    processGroupNamePath: string;
}

export interface ProcessorStatusSnapshotEntity extends BaseSnapshotEntity {
    processorStatusSnapshot: ProcessorStatusSnapshot;
}

export interface ProcessGroupStatusSnapshotEntity extends BaseSnapshotEntity {
    processGroupStatusSnapshot: ProcessGroupStatusSnapshot;
}

export interface PortStatusSnapshotEntity extends BaseSnapshotEntity {
    portStatusSnapshot: PortStatusSnapshot;
}

export enum VersionedFlowState {
    SYNC_FAILURE = 'SYNC_FAILURE',
    LOCALLY_MODIFIED = 'LOCALLY_MODIFIED',
    STALE = 'STALE',
    LOCALLY_MODIFIED_AND_STALE = 'LOCALLY_MODIFIED_AND_STALE',
    UP_TO_DATE = 'UP_TO_DATE'
}

export interface ProcessGroupStatusSnapshot extends BaseSnapshot {
    connectionStatusSnapshots: ConnectionStatusSnapshotEntity[];
    processorStatusSnapshots: ProcessorStatusSnapshotEntity[];
    processGroupStatusSnapshots: ProcessGroupStatusSnapshotEntity[];
    remoteProcessGroupStatusSnapshots: any[];
    inputPortStatusSnapshots: PortStatusSnapshotEntity[];
    outputPortStatusSnapshots: PortStatusSnapshotEntity[];

    bytesRead: number;
    bytesReceived: number;
    bytesSent: number;
    bytesTransferred: number;
    bytesWritten: number;

    read: string;
    received: string;
    sent: string;
    transferred: string;
    written: string;

    flowFilesReceived: number;
    flowFilesTransferred: number;
    flowFilesSent: number;

    activeThreadCount: number;
    processingNanos: number;
    statelessActiveThreadCount: number;
    terminatedThreadCount: number;
    versionedFlowState?: VersionedFlowState;
}

export type AggregateSnapshot = ProcessGroupStatusSnapshot;

export interface PortStatusSnapshot extends BaseSnapshot {
    runStatus: string;
    groupId: string;
    activeThreadCount: number;
}

export interface ProcessGroupStatusEntity {
    canRead: boolean;
    processGroupStatus: {
        aggregateSnapshot: AggregateSnapshot;
        id: string;
        name: string;
        statsLastRefreshed: string;
    };
}

export interface SummaryListingResponse {
    clusterSummary: ClusterSummaryEntity;
    status: ProcessGroupStatusEntity;
}

export interface SelectProcessorStatusRequest {
    id: string;
}

export interface SelectProcessGroupStatusRequest {
    id: string;
}

export interface SelectPortStatusRequest {
    id: string;
}

export interface SelectConnectionStatusRequest {
    id: string;
}

export interface SelectRemoteProcessGroupStatusRequest {
    id: string;
}

export interface SummaryListingState {
    clusterSummary: ClusterSummaryEntity | null;
    processGroupStatus: ProcessGroupStatusEntity | null;
    processorStatusSnapshots: ProcessorStatusSnapshotEntity[];
    processGroupStatusSnapshots: ProcessGroupStatusSnapshotEntity[];
    inputPortStatusSnapshots: PortStatusSnapshotEntity[];
    outputPortStatusSnapshots: PortStatusSnapshotEntity[];
    connectionStatusSnapshots: ConnectionStatusSnapshotEntity[];
    remoteProcessGroupStatusSnapshots: RemoteProcessGroupStatusSnapshotEntity[];
    loadedTimestamp: string;
    error: string | null;
    status: 'pending' | 'loading' | 'error' | 'success';
}
