/**
 * @generated SignedSource<<3c5854452c107997a116cdb48ff15c21>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SessionProviderQuery$variables = Record<PropertyKey, never>;
export type SessionProviderQuery$data = {
  readonly me: {
    readonly id: string;
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
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "me",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
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
    "cacheID": "544ad3bd17ab296a30055b00f1be8f3a",
    "id": null,
    "metadata": {},
    "name": "SessionProviderQuery",
    "operationKind": "query",
    "text": "query SessionProviderQuery {\n  me {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "9ed4a988f008d6340a5c3fb6b99bc228";

export default node;
