/**
 * @generated SignedSource<<bee3602bae0df03dfda9756b31081965>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateHabitInput = {
  days: ReadonlyArray<number>;
  description?: string | null | undefined;
  priority: number;
  time: string;
  title: string;
};
export type CreateScreenMutation$variables = {
  input: CreateHabitInput;
};
export type CreateScreenMutation$data = {
  readonly createHabit: {
    readonly description: string | null | undefined;
    readonly id: string;
    readonly priority: number;
    readonly streak: number;
    readonly time: string;
    readonly title: string;
  };
};
export type CreateScreenMutation = {
  response: CreateScreenMutation$data;
  variables: CreateScreenMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "Habit",
    "kind": "LinkedField",
    "name": "createHabit",
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
    "name": "CreateScreenMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreateScreenMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b9ae2e947bf9bc0dd1858c045750d49a",
    "id": null,
    "metadata": {},
    "name": "CreateScreenMutation",
    "operationKind": "mutation",
    "text": "mutation CreateScreenMutation(\n  $input: CreateHabitInput!\n) {\n  createHabit(input: $input) {\n    id\n    title\n    description\n    time\n    priority\n    streak\n  }\n}\n"
  }
};
})();

(node as any).hash = "55c55d00003d9f712b43f34a37bc5db1";

export default node;
