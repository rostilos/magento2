#!/bin/bash

# Get credentials for Basic Auth
BASIC_AUTH_USER=${BASIC_AUTH_USER:-""}
BASIC_AUTH_PASS=${BASIC_AUTH_PASS:-""}

# Get branch name from Bitbucket environment
BRANCH_NAME=${GITHUB_HEAD_REF:-${GITHUB_REF#refs/heads/}}

# Determine environment based on branch
if [[ "$BRANCH_NAME" == "master" || "$BRANCH_NAME" == "main" ]]; then
  TARGET_URL=$PROD_URL
elif [[ "$BRANCH_NAME" == "develop" ]]; then
  TARGET_URL=$DEV_URL
elif [[ "$BRANCH_NAME" == "stage" ]]; then
  TARGET_URL=$STAGE_URL
else
  TARGET_URL=$PROD_URL
  #echo "⚠️ Branch '$BRANCH_NAME' is not tied to any environment. Exiting script."
  #exit 1
fi

# Form authorization header (if login and password are provided)
EXTRA_HEADERS=""
if [[ -n "$BASIC_AUTH_USER" && -n "$BASIC_AUTH_PASS" ]]; then
  AUTH_HEADER="\"Authorization\": \"Basic $(echo -n "$BASIC_AUTH_USER:$BASIC_AUTH_PASS" | base64)\""
  EXTRA_HEADERS="--extra-headers={"$AUTH_HEADER"}"
  echo "EXTRA_HEADERS $EXTRA_HEADERS"
fi

# Parse JSON from environment variable
echo "Processing LIGHTHOUSE_PATHS: $LIGHTHOUSE_PATHS"
declare -A PATHS
while IFS="=" read -r key value; do
  PATHS["$key"]="$value"
done < <(echo "$LIGHTHOUSE_PATHS" | jq -r 'to_entries | .[] | "\(.key)=\(.value)"')

# Get keys for PAGES array
readarray -t PAGES < <(echo "$LIGHTHOUSE_PATHS" | jq -r 'keys[]')

echo "Pages to process: ${PAGES[*]}"
echo "Paths mapped: "
for key in "${!PATHS[@]}"; do
  echo "  $key -> ${PATHS[$key]}"
done

# Directory for saving results
RESULTS_DIR="lighthouse-results"
mkdir -p "$RESULTS_DIR"

# Define device types to test
DEVICE_TYPES=("mobile")

# Function to run Lighthouse for a specific page type and device
run_lighthouse() {
  local PAGE_TYPE=$1
  local DEVICE_TYPE=$2
  local URL="${TARGET_URL}${PATHS[$PAGE_TYPE]}"
  local OUTPUT_PREFIX="$RESULTS_DIR/${PAGE_TYPE}_${DEVICE_TYPE}"

  echo "Running Lighthouse for $PAGE_TYPE on $DEVICE_TYPE: $URL"

  # Run Lighthouse for JSON output
  lighthouse "$URL" \
    --output=json --output=html \
    --output-path="$OUTPUT_PREFIX" \
    --chrome-flags="--headless --no-sandbox --disable-gpu" \
    "$EXTRA_HEADERS" || echo "⚠️ Lighthouse failed for $PAGE_TYPE on $DEVICE_TYPE"

  # Add a pause between runs to ensure Chrome processes close properly
  sleep 2

  # Verify files were created
  if [[ -f "${OUTPUT_PREFIX}.report.json" && -f "${OUTPUT_PREFIX}.report.html" ]]; then
    echo "✅ Successfully created reports for $PAGE_TYPE on $DEVICE_TYPE"
  else
    echo "⚠️ Failed to create output files for $PAGE_TYPE on $DEVICE_TYPE"
  fi
}

# Run tests only for the determined environment
echo "Starting Lighthouse tests for environment: $TARGET_URL (branch: $BRANCH_NAME)"
for PAGE in "${PAGES[@]}"; do
  echo "===== Processing page type: $PAGE ====="
  for DEVICE in "${DEVICE_TYPES[@]}"; do
    echo "----- Testing on $DEVICE -----"
    # Run in a subshell to isolate the process
    (run_lighthouse "$PAGE" "$DEVICE")
  done
  echo "===== Completed page type: $PAGE ====="
done

echo "✅ Lighthouse checks completed. Results saved in $RESULTS_DIR."
