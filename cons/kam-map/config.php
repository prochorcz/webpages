<?php
// ----------------------------------------------------------------
// Vyplň svoje vlastní údaje a ulož. Tento soubor se nikdy neposílá
// do prohlížeče - žije jen na serveru a volá ho api.php.
// ----------------------------------------------------------------

// Pipedrive → Nastavení → Osobní preference → API → API token
define('PIPEDRIVE_API_TOKEN', 'daa03aeaa8d8f14feb560b96be02f9900286d7d2');

// Jen subdoména tvého Pipedrive účtu, bez https:// a bez lomítka na konci
// např. pokud se přihlašuješ na https://tvojefirma.pipedrive.com, vyplň:
define('PIPEDRIVE_DOMAIN', 'pm.pipedrive.com');

// Přesné názvy vlastních polí u osob (person), tak jak je vidíš v Pipedrive
define('FIELD_NAME_PJM_RELATION', 'PJM relation');
define('FIELD_NAME_DECISION_POWER', 'Decision Power');
