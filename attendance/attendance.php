<?php
header("Content-Type: application/json");

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Set HTTP status code to 405
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);
$file = 'attendance.json';

// Validate input
if (!isset($data['firstName']) || !isset($data['lastName']) || 
    trim($data['firstName']) === '' || trim($data['lastName']) === '') {
    echo json_encode(["success" => false, "message" => "Missing or empty fields"]);
    exit;
}

// Set timezone and get date/time
date_default_timezone_set("Asia/Manila");
$date = date("Y-m-d");
$time = date("H:i:s");

// Prepare the entry
$entry = [
    "date" => $date,
    "time" => $time,
    "firstName" => htmlspecialchars(trim($data['firstName']), ENT_QUOTES, 'UTF-8'),
    "lastName" => htmlspecialchars(trim($data['lastName']), ENT_QUOTES, 'UTF-8')
];

// Read existing data
if (file_exists($file)) {
    $jsonData = json_decode(file_get_contents($file), true);
    if (!is_array($jsonData)) {
        $jsonData = [];
    }
} else {
    $jsonData = [];
}

// Append and save
$jsonData[] = $entry;

if (file_put_contents($file, json_encode($jsonData, JSON_PRETTY_PRINT))) {
    echo json_encode(["success" => true, "saved" => $entry]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to write to file"]);
}
?>
