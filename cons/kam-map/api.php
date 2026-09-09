<?php
// ----------------------------------------------------------------
// api.php - jediné místo, které zná Pipedrive API token.
// Volá se z frontendu (index.html) přes fetch, nikdy přímo z prohlížeče.
// Vstup:  GET nebo POST parametr "org_id"
// Výstup: JSON  { organization: {...}, people: [...] }  nebo { error: "..." }
//
// POZOR: Pipedrive API v1 končí 31. 7. 2026 - tento soubor proto
// používá výhradně /api/v2 endpointy a autorizaci přes hlavičku
// x-api-token (aktuální doporučený/vyžadovaný způsob u v2).
// ----------------------------------------------------------------

header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/config.php';

function pd_call($path, $params = []) {
    $url = 'https://' . PIPEDRIVE_DOMAIN . '/api/v2' . $path;
    if (!empty($params)) {
        $url .= '?' . http_build_query($params);
    }

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'x-api-token: ' . PIPEDRIVE_API_TOKEN,
        'Accept: application/json',
    ]);
    $raw = curl_exec($ch);
    $curlErr = curl_error($ch);
    curl_close($ch);

    if ($curlErr) {
        return ['success' => false, 'error' => 'Chyba spojení s Pipedrive: ' . $curlErr];
    }
    $data = json_decode($raw, true);
    if (!is_array($data) || !array_key_exists('success', $data)) {
        return ['success' => false, 'error' => 'Neplatná odpověď z Pipedrive API.'];
    }
    return $data;
}

function fail($message) {
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

// 1) Vstup
$orgId = $_GET['org_id'] ?? $_POST['org_id'] ?? '';
$orgId = trim((string)$orgId);
if ($orgId === '' || !ctype_digit($orgId)) {
    fail('Zadej platné číselné ID organizace.');
}

// 2) Organizace
$orgResp = pd_call('/organizations/' . $orgId);
if (empty($orgResp['success']) || empty($orgResp['data'])) {
    fail('Organizace s ID ' . $orgId . ' nebyla v Pipedrive nalezena.');
}
$orgName = $orgResp['data']['name'] ?? ('Organizace #' . $orgId);

// 3) Definice vlastních polí u osob - najdeme field_code podle názvu
//    (ne podle pevného hashe, aby appka fungovala, i kdyby se pole
//    v Pipedrive muselo znovu vytvořit).
$fieldsResp = pd_call('/personFields');
$pjmKey = null; $dpKey = null;

if (!empty($fieldsResp['success']) && !empty($fieldsResp['data'])) {
    foreach ($fieldsResp['data'] as $field) {
        $name = strtolower(trim($field['field_name'] ?? ''));
        if ($name === strtolower(FIELD_NAME_PJM_RELATION)) {
            $pjmKey = $field['field_code'];
        }
        if ($name === strtolower(FIELD_NAME_DECISION_POWER)) {
            $dpKey = $field['field_code'];
        }
    }
}

function resolve_option($rawValue) {
    // API v2 s include_option_labels=true vrací u single-option polí
    // rovnou { id, label } - samostatná tabulka "options" už není potřeba.
    if ($rawValue === null || $rawValue === '') return null;
    if (is_array($rawValue)) {
        return $rawValue['label'] ?? null;
    }
    return (string)$rawValue;
}

// 4) Osoby PATŘÍCÍ K TÉTO ORGANIZACI.
//    Pipedrive API v1 /persons nikdy filtr org_id nepodporoval (tiše ho
//    ignoroval a vracel VŠECHNY osoby v účtu) - proto appka dřív
//    neomezovala výpis na vybranou organizaci. API v2 org_id filtr
//    skutečně respektuje, takže přechod na v2 tuto chybu zároveň opravuje.
$customFieldKeys = array_filter([$pjmKey, $dpKey]);
$people = [];
$cursor = null;

do {
    $params = [
        'org_id'                => $orgId,
        'limit'                 => 100,
        'include_option_labels' => 'true',
    ];
    if (!empty($customFieldKeys)) {
        $params['custom_fields'] = implode(',', $customFieldKeys);
    }
    if ($cursor) {
        $params['cursor'] = $cursor;
    }

    $resp = pd_call('/persons', $params);
    if (empty($resp['success'])) break;

    $batch = $resp['data'] ?: [];
    foreach ($batch as $p) {
        $customFields = $p['custom_fields'] ?? [];
        $pjmRaw = $pjmKey ? ($customFields[$pjmKey] ?? null) : null;
        $dpRaw  = $dpKey  ? ($customFields[$dpKey]  ?? null) : null;

        $people[] = [
            'id'             => $p['id'],
            'first_name'     => $p['first_name'] ?? '',
            'last_name'      => $p['last_name'] ?? '',
            'position'       => $p['job_title'] ?? '',
            'pjm_relation'   => resolve_option($pjmRaw),
            'decision_power' => resolve_option($dpRaw),
        ];
    }

    $cursor = $resp['additional_data']['next_cursor'] ?? null;
} while ($cursor);

echo json_encode([
    'organization' => ['id' => (int)$orgId, 'name' => $orgName],
    'people'       => $people,
], JSON_UNESCAPED_UNICODE);
