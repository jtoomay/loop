/**
 * @generated SignedSource<<4a0603195e3fac0de35a4b5d8c49bf17>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type exploreQuery$variables = {
  num1: number;
  num2: number;
};
export type exploreQuery$data = {
  readonly addNumbers: number;
};
export type exploreQuery = {
  response: exploreQuery$data;
  variables: exploreQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "num1"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "num2"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "a",
        "variableName": "num1"
      },
      {
        "kind": "Variable",
        "name": "b",
        "variableName": "num2"
      }
    ],
    "kind": "ScalarField",
    "name": "addNumbers",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "exploreQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "exploreQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "bdbc49f0624a80c46d896554c0b0a15c",
    "id": null,
    "metadata": {},
    "name": "exploreQuery",
    "operationKind": "query",
    "text": "query exploreQuery(\n  $num1: Int!\n  $num2: Int!\n) {\n  addNumbers(a: $num1, b: $num2)\n}\n"
  }
};
})();

(node as any).hash = "aa7a945adcc6d4862b5ee647544cbf07";

export default node;
