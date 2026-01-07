/**
 * @generated SignedSource<<bed56b7ef223c4e870215287e5a0fdbf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type HabitsQuery$variables = {
  timezone: string;
};
export type HabitsQuery$data = {
  readonly habits: ReadonlyArray<{
    readonly description: string | null | undefined;
    readonly id: string;
    readonly priority: number;
    readonly streak: number;
    readonly time: string;
    readonly title: string;
  }>;
};
export type HabitsQuery = {
  response: HabitsQuery$data;
  variables: HabitsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "timezone"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "timezone",
        "variableName": "timezone"
      }
    ],
    "concreteType": "Habit",
    "kind": "LinkedField",
    "name": "habits",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "title",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "description",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "time",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "priority",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "streak",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "HabitsQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "HabitsQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "85d14a07fe20dac9eb1e33bf38643ce2",
    "id": null,
    "metadata": {},
    "name": "HabitsQuery",
    "operationKind": "query",
    "text": "query HabitsQuery(\n  $timezone: String!\n) {\n  habits(timezone: $timezone) {\n    id\n    title\n    description\n    time\n    priority\n    streak\n  }\n}\n"
  }
};
})();

(node as any).hash = "0950d13a19aa224568c0a0b1cd787de9";

export default node;
