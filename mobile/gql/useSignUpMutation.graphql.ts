/**
 * @generated SignedSource<<4761a10e9611b2bf53096442d996e10a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useSignUpMutation$variables = {
  email: string;
  password: string;
};
export type useSignUpMutation$data = {
  readonly signup: {
    readonly accessToken: string;
    readonly refreshToken: string;
  };
};
export type useSignUpMutation = {
  response: useSignUpMutation$data;
  variables: useSignUpMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "email"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "password"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      },
      {
        "kind": "Variable",
        "name": "password",
        "variableName": "password"
      }
    ],
    "concreteType": "Session",
    "kind": "LinkedField",
    "name": "signup",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "accessToken",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "refreshToken",
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
    "name": "useSignUpMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useSignUpMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "fd590352213010dba9bf4aa4f70023e0",
    "id": null,
    "metadata": {},
    "name": "useSignUpMutation",
    "operationKind": "mutation",
    "text": "mutation useSignUpMutation(\n  $email: String!\n  $password: String!\n) {\n  signup(email: $email, password: $password) {\n    accessToken\n    refreshToken\n  }\n}\n"
  }
};
})();

(node as any).hash = "8285d30780de5cb27bc119f521841567";

export default node;
