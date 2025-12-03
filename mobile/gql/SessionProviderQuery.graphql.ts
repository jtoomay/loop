/**
 * @generated SignedSource<<6c3986b45a49b8028ee9316834299ca4>>
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
    readonly jwt: string;
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
        "name": "jwt",
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
    "cacheID": "f608c3261bd48aebf2f4952b5fd2a5a3",
    "id": null,
    "metadata": {},
    "name": "SessionProviderQuery",
    "operationKind": "query",
    "text": "query SessionProviderQuery {\n  session {\n    id\n    jwt\n  }\n}\n"
  }
};
})();

(node as any).hash = "9b2fccd53e39266011e08d0572a17af6";

export default node;
