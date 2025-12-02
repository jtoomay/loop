/**
 * @generated SignedSource<<1f1ae3152d81efd56d5f4fd8eee1558c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TabsQuery$variables = Record<PropertyKey, never>;
export type TabsQuery$data = {
  readonly hello: string;
  readonly me: {
    readonly id: string;
    readonly name: string;
  };
};
export type TabsQuery = {
  response: TabsQuery$data;
  variables: TabsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "hello",
    "storageKey": null
  },
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
    "name": "TabsQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "TabsQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "2944dcfabcb90d298f30036aa71e7f0f",
    "id": null,
    "metadata": {},
    "name": "TabsQuery",
    "operationKind": "query",
    "text": "query TabsQuery {\n  hello\n  me {\n    id\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "1ae48f713648131565cf4467a540d5af";

export default node;
