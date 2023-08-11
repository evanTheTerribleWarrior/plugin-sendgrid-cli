#!/bin/bash

# Function to manage webhooks
manage_webhooks() {
    local webhook_options=("List current webhooks" "Create new webhook" "Go back")
    
    select webhook_option in "${webhook_options[@]}"; do
        case $webhook_option in
            "List current webhooks")
                echo "Listing current webhooks..."
                twilio sendgrid:event-tracking:webhooks:list -o json
                ;;
            "Create new webhook")
                echo "Creating a new webhook..."
                # Replace this with the command to create a new webhook
                ;;
            "Go back")
                break
                ;;
            *)
                echo "Invalid option"
                ;;
        esac
    done
}

# Main menu options
options=("Manage your webhooks" "Exit")

# Display main menu
select main_option in "${options[@]}"; do
    case $main_option in
        "Manage your webhooks")
            manage_webhooks
            ;;
        "Exit")
            echo "Exiting..."
            break
            ;;
        *)
            echo "Invalid option"
            ;;
    esac
done
