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
import undetected_chromedriver as uc


class FlightSearcher:
    def __init__(self, from_city, to_city, departure_date, return_date):
        """Initialize the flight searcher with trip details."""
        self.from_city = from_city
        self.to_city = to_city
        self.departure_date = departure_date
        self.return_date = return_date
        self.driver = None
        # self.options = Options()
        self.options = uc.ChromeOptions()
        self.options.add_argument("--start-maximized")
        # self.options.add_argument("--window-position=10000,10000")  # Move it offscreen
        print(f"✨ Initializing flight search from {from_city} to {to_city}")
        print(f"📅 Departure: {departure_date} | Return: {return_date}")
    
    def start_browser(self):
        """Launch the browser and navigate to Kayak."""
        print("🚀 Launching Chrome browser...")
        # self.driver = webdriver.Chrome(options=self.options)
        self.driver = uc.Chrome(options=self.options)
        self.driver.get("https://www.kayak.com/flights")
        print("🌐 Navigated to Kayak flights page")
        time.sleep(2)
        
    def handle_popups(self):
        """Handle any initial popups like cookie notices."""
        print("🔍 Checking for popups...")
        try:
            wait = WebDriverWait(self.driver, 5)
            understand_button = wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//button[.//div[text()='I understand']]")
            ))
            understand_button.click()
            print("✅ Closed 'I understand' popup")
        except Exception:
            print("ℹ️ No popups found or already handled")
    
    def clear_existing_cities(self):
        """Clear any pre-selected cities."""
        print("🧹 Clearing any pre-selected cities...")
        try:
            close_buttons = WebDriverWait(self.driver, 5).until(
                EC.presence_of_all_elements_located((By.XPATH, "//div[@class='c_neb-item-close']"))
            )
            for btn in close_buttons:
                try:
                    btn.click()
                    time.sleep(0.5)
                except:
                    pass
            print("✅ Cleared pre-selected cities")
        except:
            print("ℹ️ No pre-selected cities to clear")
    
    def set_from_city(self):
        """Set the departure city."""
        print(f"🛫 Setting departure city to {self.from_city}...")
        try:
            from_input = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//input[@aria-label='Flight origin input']"))
            )
            from_input.click()
            from_input.clear()
            from_input.send_keys(self.from_city)
            time.sleep(2)  # Let dropdown load
            
            from_option_xpath = "//ul[contains(@id,'flight-origin-smarty-input-list')]//li[@role='option'][1]"
            from_option = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, from_option_xpath))
            )
            from_option.click()
            print(f"✅ Set departure city: {self.from_city}")
            time.sleep(2)
        except Exception as e:
            print(f"❌ Error setting departure city: {str(e)}")
    
    def set_to_city(self):
        """Set the destination city."""
        print(f"🛬 Setting destination city to {self.to_city}...")
        try:
            to_input = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//input[@aria-label='Flight destination input']"))
            )
            to_input.click()
            to_input.clear()
            to_input.send_keys(self.to_city)
            time.sleep(2)  # Let dropdown load
            
            to_option_xpath = "//ul[contains(@id,'flight-destination-smarty-input-list')]//li[@role='option'][1]"
            to_option = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, to_option_xpath))
            )
            to_option.click()
            print(f"✅ Set destination city: {self.to_city}")
            time.sleep(2)
        except Exception as e:
            print(f"❌ Error setting destination city: {str(e)}")
    
    def select_departure_date(self):
        """Select the departure date on the calendar."""
        print(f"📆 Selecting departure date: {self.departure_date}...")
        try:
            departure_date_obj = datetime.strptime(self.departure_date, "%Y-%m-%d")
            aria_label = departure_date_obj.strftime("%B %#d, %Y")
            
            WebDriverWait(self.driver, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "OV9e-cal-wrapper"))
            )
            
            date_xpath = f"//div[@role='button' and contains(@aria-label, '{aria_label}')]"
            date_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, date_xpath))
            )
            date_button.click()
            print(f"✅ Selected departure date: {aria_label}")
            time.sleep(1)
        except Exception as e:
            print(f"❌ Error selecting departure date: {str(e)}")
    
    def select_return_date(self):
        """Select the return date on the calendar."""
        print(f"📆 Selecting return date: {self.return_date}...")
        try:
            return_date_obj = datetime.strptime(self.return_date, "%Y-%m-%d")
            aria_label = return_date_obj.strftime("%B %#d, %Y")
            
            print("📦 Opening return date selector...")
            return_box = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//div[@role='button' and @aria-label='Return']"))
            )
            return_box.click()
            time.sleep(1)
            
            WebDriverWait(self.driver, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "OV9e-cal-wrapper"))
            )
            
            date_xpath = f"//div[@role='button' and contains(@aria-label, '{aria_label}')]"
            date_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, date_xpath))
            )
            date_button.click()
            print(f"✅ Selected return date: {aria_label}")
            time.sleep(1)
        except Exception as e:
            print(f"❌ Error selecting return date: {str(e)}")
    
    def click_search(self):
        """Click the search button to initiate the flight search."""
        print("🔍 Initiating flight search...")
        try:
            search_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable(
                    (By.XPATH, "//button[@role='button' and @aria-label='Search']")
                )
            )
            search_button.click()
            print("✅ Search button clicked!")
            time.sleep(2)
        except Exception as e:
            print(f"❌ Error clicking search button: {str(e)}")
    
    def switch_to_results_tab(self):
        """Switch to the results tab that opens after search."""
        print("🔄 Switching to results tab...")
        self.driver.switch_to.window(self.driver.window_handles[-1])
        print("✅ Switched to results tab")
    
    def extract_flight_data(self):
        """Extract flight information from the search results."""
        print("📊 Extracting flight data...")
        print("⏳ Please wait while we analyze the search results...")
        wait = WebDriverWait(self.driver, 40)
        
        try:
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".nrc6-inner")))
            print("✅ Flight results loaded successfully")
            
            flight_cards = self.driver.find_elements(By.CSS_SELECTOR, '[aria-label^="Result item"]')
            
            if not flight_cards:
                print("⚠️ No flight results found")
                return None
            
            print(f"🎯 Found {len(flight_cards)} flight options")
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
                            "date": self.departure_date if len(flights) % 2 == 0 else self.return_date
                        })
                    
                    try:
                        price = card.find_element(By.CSS_SELECTOR, ".f8F1-price-text").text
                    except:
                        price = "N/A"
                    
                    flights.append({
                        "legs": all_legs,
                        "price": price
                    })
                
                except Exception as e:
                    print(f"⚠️ Error parsing flight card: {str(e)}")
            
            # Convert to DataFrame
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
            print("✅ Flight data extraction complete")
            # print(f"📈 Found {len(flights)} flight options")
            
            # # Save to CSV
            # df_flights.to_csv("flight_results.csv", index=False)
            # print("💾 Results saved to 'flight_results.csv'")
            json_results = df_flights.to_dict(orient="records")
            return json_results
        
        except TimeoutException:
            print("⏱️ Timeout! Couldn't load flight results.")
            self.driver.save_screenshot("flight_results_timeout.png")
            print("📸 Screenshot saved as 'flight_results_timeout.png'")
            return None
    
    def print_flight_table(self, flights):
        """Print a formatted table of flight options."""
        if not flights or flights.empty:
            print("❌ No flight data to display")
            return
        
        print("\n📋 Flight Results Summary:\n")
        
        # Group by Option to get unique flights
        options = flights['Option'].unique()
        
        for option in options:
            option_flights = flights[flights['Option'] == option]
            price = option_flights['Price'].iloc[0]
            print(f"\n✈️  Option {int(option)}: {price}")
            
            for _, flight in option_flights.iterrows():
                print(f"  {flight['Airline']} | {flight['From']} → {flight['To']} | {flight['Depart']} - {flight['Arrive']} | Duration: {flight['Duration']} | Stops: {flight['Stops']}")
            
            print("-" * 80)
    
    def close_browser(self):
        """Close the browser."""
        print("👋 Closing browser...")
        if self.driver:
            self.driver.quit()
    
    def run_search(self):
        """Execute the complete flight search process."""
        print("\n🔍 STARTING FLIGHT SEARCH 🔍")
        print("=" * 50)
        
        try:
            self.start_browser()
            self.handle_popups()
            self.clear_existing_cities()
            self.set_from_city()
            self.set_to_city()
            self.select_departure_date()
            self.select_return_date()
            self.click_search()
            self.switch_to_results_tab()
            flights = self.extract_flight_data()

            if flights:
                # self.print_flight_table(flights)  # Optional: remove if you only want JSON
                print("\n✅ Flight search completed successfully!")
                return {
                    "status": "success",
                    "flights": flights
                }
            else:
                print("⚠️ No flights found")
                return {
                    "status": "error",
                    "message": "No flights found"
                    }
            
        except Exception as e:
            print(f"\n❌ Error during flight search: {str(e)}")
        finally:
            self.close_browser()
            print("=" * 50)
            print("🏁 FLIGHT SEARCH PROCESS ENDED 🏁")


# Usage example
if __name__ == "__main__":
    print("🌟 Welcome to the Flight Search Tool 🌟")
    print("Finding the best flights for your trip...")
    
    # You can replace these with user inputs
    searcher = FlightSearcher(
        from_city="Las Vegas",
        to_city="New York",
        departure_date="2025-4-10",
        return_date="2025-4-17"
    )
    
    flight_details = searcher.run_search()
    print(flight_details)
