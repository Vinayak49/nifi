/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NiFiState } from '../../../../state';
import { ParameterProviderEntity, ParameterProvidersState } from '../../state/parameter-providers';
import { selectCurrentUser } from '../../../../state/current-user/current-user.selectors';
import {
    selectParameterProvider,
    selectParameterProviderIdFromRoute,
    selectParameterProvidersState,
    selectSingleEditedParameterProvider
} from '../../state/parameter-providers/parameter-providers.selectors';
import { selectFlowConfiguration } from '../../../../state/flow-configuration/flow-configuration.selectors';
import { loadFlowConfiguration } from '../../../../state/flow-configuration/flow-configuration.actions';
import * as ParameterProviderActions from '../../state/parameter-providers/parameter-providers.actions';
import { initialParameterProvidersState } from '../../state/parameter-providers/parameter-providers.reducer';
import { switchMap, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isDefinedAndNotNull } from '../../../../state/shared';

@Component({
    selector: 'parameter-providers',
    templateUrl: './parameter-providers.component.html',
    styleUrls: ['./parameter-providers.component.scss']
})
export class ParameterProviders implements OnInit, OnDestroy {
    currentUser$ = this.store.select(selectCurrentUser);
    parameterProvidersState$ = this.store.select(selectParameterProvidersState);
    selectedParameterProviderId$ = this.store.select(selectParameterProviderIdFromRoute);
    flowConfiguration$ = this.store.select(selectFlowConfiguration);

    constructor(private store: Store<NiFiState>) {
        this.store
            .select(selectSingleEditedParameterProvider)
            .pipe(
                isDefinedAndNotNull(),
                switchMap((id: string) =>
                    this.store.select(selectParameterProvider(id)).pipe(isDefinedAndNotNull(), take(1))
                ),
                takeUntilDestroyed()
            )
            .subscribe((entity) => {
                this.store.dispatch(
                    ParameterProviderActions.openConfigureParameterProviderDialog({
                        request: {
                            id: entity.id,
                            parameterProvider: entity
                        }
                    })
                );
            });
    }

    ngOnInit(): void {
        this.store.dispatch(loadFlowConfiguration());
        this.store.dispatch(ParameterProviderActions.loadParameterProviders());
    }

    ngOnDestroy(): void {
        this.store.dispatch(ParameterProviderActions.resetParameterProvidersState());
    }

    isInitialLoading(state: ParameterProvidersState): boolean {
        // using the current timestamp to detect the initial load event
        return state.loadedTimestamp == initialParameterProvidersState.loadedTimestamp;
    }

    refreshParameterProvidersListing(): void {
        this.store.dispatch(ParameterProviderActions.loadParameterProviders());
    }

    openNewParameterProviderDialog() {
        this.store.dispatch(ParameterProviderActions.openNewParameterProviderDialog());
    }

    openConfigureParameterProviderDialog(parameterProvider: ParameterProviderEntity) {
        this.store.dispatch(
            ParameterProviderActions.navigateToEditParameterProvider({
                id: parameterProvider.component.id
            })
        );
    }

    selectParameterProvider(parameterProvider: ParameterProviderEntity) {
        this.store.dispatch(
            ParameterProviderActions.selectParameterProvider({
                request: {
                    id: parameterProvider.id
                }
            })
        );
    }

    deleteParameterProvider(parameterProvider: ParameterProviderEntity) {
        this.store.dispatch(
            ParameterProviderActions.promptParameterProviderDeletion({
                request: {
                    parameterProvider
                }
            })
        );
    }
}
