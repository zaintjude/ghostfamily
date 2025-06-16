<?php
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$file = 'attendance.json';

if (!isset($data['firstName']) || !isset($data['lastName'])) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

// Use PHP to get date and time
date_default_timezone_set("Asia/Manila"); // set your timezone
$date = date("Y-m-d");
$time = date("H:i:s");

$entry = [
    "date" => $date,
    "time" => $time,
    "firstName" => $data['firstName'],
    "lastName" => $data['lastName']
];

// Read existing data
if (file_exists($file)) {
    $jsonData = json_decode(file_get_contents($file), true);
    if (!is_array($jsonData)) $jsonData = [];
} else {
    $jsonData = [];
}

// Append new entry
$jsonData[] = $entry;

// Save it back
if (file_put_contents($file, json_encode($jsonData, JSON_PRETTY_PRINT))) {
    echo json_encode(["success" => true, "saved" => $entry]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to write to file"]);
}
