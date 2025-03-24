from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
from datetime import datetime
from selenium.common.exceptions import TimeoutException
from prettytable import PrettyTable
import pandas as pd


# ----------- USER INPUT SECTION -----------
FROM_CITY = "Las Vegas"
TO_CITY = "New York"
DEPARTURE_DATE = "2025-4-10"
RETURN_DATE = "2025-4-17"

# ----------- SELENIUM AUTOMATION -----------
def run_flight_search():
    # Step 1: Configure Chrome options
    options = Options()
    options.add_argument("--start-maximized")

    try:
        # Step 2: Launch Chrome browser and open Kayak
        driver = webdriver.Chrome(options=options)
        driver.get("https://www.kayak.com/flights")

        # Optional: Wait for a few seconds to view the page before exiting
        time.sleep(2)

        # Step 3: Wait and close the "I understand" popup if present
        try:
            wait = WebDriverWait(driver, 5)
            understand_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[.//div[text()='I understand']]")))
            understand_button.click()
            print("✅ Clicked 'I understand' button")
        except Exception as e:
            print("⚠️ 'I understand' button not found or already handled")

        # --------- CLEAR ALL EXISTING CITIES FIRST ---------
        try:
            # There could be multiple close buttons for both From and To
            close_buttons = WebDriverWait(driver, 5).until(
                EC.presence_of_all_elements_located((By.XPATH, "//div[@class='c_neb-item-close']"))
            )
            for btn in close_buttons:
                try:
                    btn.click()
                    print("🧹 Cleared one city chip")
                    time.sleep(0.5)
                except:
                    pass
        except:
            print("ℹ️ No pre-selected city chips to clear")
        
        # -------- SET "FROM" CITY --------
        try:
            from_input = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//input[@aria-label='Flight origin input']"))
            )
            from_input.click()
            from_input.clear()
            from_input.send_keys(FROM_CITY)
            print(f"✏️ Typed '{FROM_CITY}' in From input")
            time.sleep(2)  # Let dropdown load

            from_option_xpath = "//ul[contains(@id,'flight-origin-smarty-input-list')]//li[@role='option'][1]"
            from_option = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, from_option_xpath))
            )
            from_option.click()
            print("✅ Selected From city from dropdown")
            time.sleep(2)  # Ensure selection is registered
        except Exception as e:
            print("❌ Error handling From city:", str(e)) 

        # -------- SET "TO" CITY --------
        try:
            to_input = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//input[@aria-label='Flight destination input']"))
            )
            to_input.click()
            to_input.clear()
            to_input.send_keys(TO_CITY)
            print(f"✏️ Typed '{TO_CITY}' in To input")
            time.sleep(2)  # Let dropdown load

            to_option_xpath = "//ul[contains(@id,'flight-destination-smarty-input-list')]//li[@role='option'][1]"
            to_option = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, to_option_xpath))
            )
            to_option.click()
            print("✅ Selected To city from dropdown")
            time.sleep(2)  # Ensure selection is registered
        except Exception as e:
            print("❌ Error handling To city:", str(e))

        
        select_departure_date(driver, DEPARTURE_DATE)
        select_return_date(driver, RETURN_DATE)
        click_search_button(driver)
        time.sleep(2)  # Give the tab time to load
        for i, handle in enumerate(driver.window_handles):
            print(f"🪟 Tab {i + 1}: {handle}")
        switch_to_latest_tab(driver)
        extract_flight_data(driver)

    finally:
        driver.quit()

def select_departure_date(driver, departure_date_str):
    try:
        # Convert '2025-04-10' to 'April 10, 2025'
        departure_date = datetime.strptime(departure_date_str, "%Y-%m-%d")
        aria_label = departure_date.strftime("%B %#d, %Y")  # e.g. April 4, 2025

        print(f"🔍 Looking for departure date: {aria_label}")

        # Wait for calendar to be visible
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.CLASS_NAME, "OV9e-cal-wrapper"))
        )

        # Scroll through months if needed (optional: here we assume it's already visible)
        date_xpath = f"//div[@role='button' and contains(@aria-label, '{aria_label}')]"
        date_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, date_xpath))
        )
        date_button.click()
        print(f"✅ Selected departure date: {aria_label}")
        time.sleep(1)
    except Exception as e:
        print("❌ Error selecting departure date:", str(e))

def select_return_date(driver, return_date_str):
    try:
        # Convert '2025-04-15' to 'April 15, 2025'
        return_date = datetime.strptime(return_date_str, "%Y-%m-%d")
        aria_label = return_date.strftime("%B %#d, %Y")  # e.g. April 15, 2025

        print("📦 Clicking return box...")
        return_box = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[@role='button' and @aria-label='Return']"))
        )
        return_box.click()
        time.sleep(1)

        print(f"🔍 Looking for return date: {aria_label}")
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.CLASS_NAME, "OV9e-cal-wrapper"))
        )

        date_xpath = f"//div[@role='button' and contains(@aria-label, '{aria_label}')]"
        date_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, date_xpath))
        )
        date_button.click()
        print(f"✅ Selected return date: {aria_label}")
        time.sleep(1)

    except Exception as e:
        print("❌ Error selecting return date:", str(e))

def click_search_button(driver):
    try:
        print("🔍 Locating search button...")

        search_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable(
                (By.XPATH, "//button[@role='button' and @aria-label='Search']")
            )
        )
        search_button.click()
        print("✅ Search button clicked!")

    except Exception as e:
        print("❌ Error clicking search button:", str(e))

def switch_to_latest_tab(driver):
    driver.switch_to.window(driver.window_handles[-1])
    print("🔀 Switched to latest tab.")


def extract_flight_data(driver):
    import pandas as pd
    print("🔍 Waiting for flight result cards to load...")

    wait = WebDriverWait(driver, 40)

    try:
        # ✅ First wait for any container that must exist once results are ready
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".nrc6-inner")))

        # ✅ Then find only flight cards with aria-label "Result item N"
        flight_cards = driver.find_elements(By.CSS_SELECTOR, '[aria-label^="Result item"]')

        if not flight_cards:
            print("⚠️ No flight result cards found. The structure may have changed.")
            return

        flights = []

        for card in flight_cards:
            try:
                legs = card.find_elements(By.CSS_SELECTOR, "li.hJSA-item")
                all_legs = []

                for leg in legs:
                    departure_time = leg.find_element(By.CSS_SELECTOR, ".VY2U .vmXl span:nth-child(1)").text
                    arrival_time = leg.find_element(By.CSS_SELECTOR, ".VY2U .vmXl span:nth-child(3)").text
                    airline = leg.find_element(By.CSS_SELECTOR, ".VY2U .c_cgF").text
                    duration = leg.find_element(By.CSS_SELECTOR, ".xdW8 .vmXl").text
                    stops = leg.find_element(By.CSS_SELECTOR, ".JWEO .vmXl span").text
                    from_airport = leg.find_elements(By.CSS_SELECTOR, ".jLhY-airport-info span")[0].text
                    to_airport = leg.find_elements(By.CSS_SELECTOR, ".jLhY-airport-info span")[1].text

                    # Try extracting stop detail (e.g., layover duration)
                    try:
                        stop_detail = leg.find_element(By.CSS_SELECTOR, ".JWEO .c_cgF span span").get_attribute("title")
                    except:
                        stop_detail = "N/A"

                    all_legs.append({
                        "from": from_airport,
                        "to": to_airport,
                        "airline": airline,
                        "depart": departure_time,
                        "arrive": arrival_time,
                        "duration": duration,
                        "stops": stops,
                        "stop_detail": stop_detail,
                        "date": DEPARTURE_DATE  # Adding date from user input
                    })

                # Get price
                try:
                    price = card.find_element(By.CSS_SELECTOR, ".f8F1-price-text").text
                except:
                    price = "N/A"

                flights.append({
                    "legs": all_legs,
                    "price": price
                })

            except Exception as e:
                print(f"❌ Error parsing card: {e}")

        # Convert all flight legs to flat records for DataFrame
        flight_rows = []
        for i, flight in enumerate(flights, start=1):
            for leg in flight['legs']:
                row = {
                    "Option": i,
                    "From": leg['from'],
                    "To": leg['to'],
                    "Airline": leg['airline'],
                    "Depart": leg['depart'],
                    "Arrive": leg['arrive'],
                    "Duration": leg['duration'],
                    "Stops": leg['stops'],
                    "Stop Detail": leg['stop_detail'],
                    "Date": leg['date'],
                    "Price": flight['price']
                }
                flight_rows.append(row)

        df_flights = pd.DataFrame(flight_rows)
        print("\n📊 DataFrame Preview:")
        print(df_flights.head())

        # Optional: Save to CSV
        df_flights.to_csv("flight_results.csv", index=False)

        return df_flights  # Optional: if you want to use it elsewhere

    except TimeoutException:
        print("⏱️ Timeout! Couldn't find flight cards.")
        # Optional: Take screenshot to debug
        driver.save_screenshot("flight_results_timeout.png")
        print("📸 Screenshot saved as 'flight_results_timeout.png'")

def print_flight_table(flights):
    print("\n📋 Flight Results:\n")
    for i, flight in enumerate(flights, 1):
        print(f"✈️  Option {i}: ${flight['price']}")
        table = PrettyTable()
        table.field_names = ["From", "To", "Airline", "Depart", "Arrive", "Duration", "Stops"]

        for leg in flight['legs']:
            table.add_row([
                leg['from'], leg['to'], leg['airline'],
                leg['depart'], leg['arrive'], leg['duration'],
                leg['stops']
            ])
        print(table)
        print("-" * 80)


if __name__ == "__main__":
    run_flight_search()
