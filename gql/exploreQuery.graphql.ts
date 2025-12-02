/**
 * @generated SignedSource<<cbd64cd6a0dcc0c0d61b39689c23be6b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type exploreQuery$variables = Record<PropertyKey, never>;
export type exploreQuery$data = {
  readonly users: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
  }>;
};
export type exploreQuery = {
  response: exploreQuery$data;
  variables: exploreQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "users",
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
        "name": "name",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "exploreQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "exploreQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "30b44e2e18081128d03940318dc819a3",
    "id": null,
    "metadata": {},
    "name": "exploreQuery",
    "operationKind": "query",
    "text": "query exploreQuery {\n  users {\n    id\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "972032e4a7372b584521a55ffb4c0196";

export default node;
