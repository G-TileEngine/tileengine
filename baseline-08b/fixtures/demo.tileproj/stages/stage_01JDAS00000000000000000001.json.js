export default {
  "kind": "stage",
  "formatVersion": 2,
  "id": "stage_01JDAS00000000000000000001",
  "rev": 1,
  "name": "Demo stage",
  "mapRef": "map_01JDAM00000000000000000001",
  "seed": 24301,
  "playerSpawns": [
    {
      "c": 0,
      "r": 8,
      "facing": "N"
    },
    {
      "c": 1,
      "r": 8
    }
  ],
  "neutrals": [
    {
      "unitId": "unit_01JDAN00000000000000000006",
      "at": {
        "c": 3,
        "r": 4
      }
    },
    {
      "unitId": "unit_01JDAN00000000000000000007",
      "at": {
        "c": 4,
        "r": 4
      },
      "facing": "W",
      "side": "player"
    },
    {
      "unitId": "unit_01JDAN00000000000000000005",
      "at": {
        "c": 5,
        "r": 4
      },
      "facing": "S",
      "setupIds": [
        "setup_01JDAT00000000000000000001"
      ]
    }
  ],
  "sides": {
    "enemyPool": "wolves"
  },
  "enemyPool": {
    "mode": "fixed",
    "entries": [
      {
        "unitId": "unit_01JDAN00000000000000000004",
        "at": {
          "c": 2,
          "r": 0
        },
        "facing": "S"
      },
      {
        "unitId": "unit_01JDAN00000000000000000004",
        "at": {
          "c": 3,
          "r": 0
        }
      }
    ]
  },
  "loadout": null,
  "rules": [],
  "overrides": {
    "setups": {},
    "units": {}
  },
  "difficulty": null,
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
