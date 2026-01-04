/**
 * @generated SignedSource<<1020d758858bc1549a9cb171d81123d7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime'
export type HomeScreenQuery$variables = {
  timezone: string
}
export type HomeScreenQuery$data = {
  readonly habits: ReadonlyArray<{
    readonly description: string | null | undefined
    readonly id: string
    readonly priority: number
    readonly streak: number
    readonly time: string
    readonly title: string
  }>
}
export type HomeScreenQuery = {
  response: HomeScreenQuery$data
  variables: HomeScreenQuery$variables
}

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: 'LocalArgument',
        name: 'timezone',
      },
    ],
    v1 = [
      {
        alias: null,
        args: [
          {
            kind: 'Variable',
            name: 'timezone',
            variableName: 'timezone',
          },
        ],
        concreteType: 'Habit',
        kind: 'LinkedField',
        name: 'habits',
        plural: true,
        selections: [
          {
            alias: null,
            args: null,
            kind: 'ScalarField',
            name: 'id',
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: 'ScalarField',
            name: 'title',
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: 'ScalarField',
            name: 'description',
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: 'ScalarField',
            name: 'time',
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: 'ScalarField',
            name: 'priority',
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: 'ScalarField',
            name: 'streak',
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ]
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Fragment',
      metadata: null,
      name: 'HomeScreenQuery',
      selections: v1 /*: any*/,
      type: 'Query',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Operation',
      name: 'HomeScreenQuery',
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: '547607e58c9ccb4c5aa874863fbb9f79',
      id: null,
      metadata: {},
      name: 'HomeScreenQuery',
      operationKind: 'query',
      text: 'query HomeScreenQuery(\n  $timezone: String!\n) {\n  habits(timezone: $timezone) {\n    id\n    title\n    description\n    time\n    priority\n    streak\n  }\n}\n',
    },
  }
})()

;(node as any).hash = '3fe68da72294b9a98ddbf45682b4217a'

export default node
