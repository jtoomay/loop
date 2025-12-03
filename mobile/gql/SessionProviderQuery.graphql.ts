/**
 * @generated SignedSource<<02689aa30c9f204218a62f64dfd63bc5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SessionProviderQuery$variables = Record<PropertyKey, never>;
export type SessionProviderQuery$data = {
  readonly session: {
    readonly id: string;
    readonly token: string;
  } | null | undefined;
};
export type SessionProviderQuery = {
  response: SessionProviderQuery$data;
  variables: SessionProviderQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Session",
    "kind": "LinkedField",
    "name": "session",
    "plural": false,
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
        "name": "token",
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
    "name": "SessionProviderQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SessionProviderQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "724e062b1b7879463aca05cb5196e2f8",
    "id": null,
    "metadata": {},
    "name": "SessionProviderQuery",
    "operationKind": "query",
    "text": "query SessionProviderQuery {\n  session {\n    id\n    token\n  }\n}\n"
  }
};
})();

(node as any).hash = "382f21578caa4c9d1a73b512f1b3efbe";

export default node;
