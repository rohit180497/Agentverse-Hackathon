import gradio as gr
from supervisor.supervisor import SupervisorAgent

# Initialize agent
agent = SupervisorAgent()

# Core chat function with error handling
def chat_fn(message, history):
    try:
        result = agent.chat(message)

        if "error" in result:
            print("[❌ Error from SupervisorAgent]", result)
            return f"❌ Error: {result['details']}"
        
        print("[✅ Agent Response]", result.get("message"))
        return result.get("message", "⚠️ No response message returned.")
    
    except Exception as e:
        print("[🚨 Unhandled Exception]", str(e))
        return f"🚨 Unexpected error: {str(e)}"

# Gradio UI
with gr.Blocks(theme=gr.themes.Soft()) as demo:
    gr.Markdown("## ✈️ TravelGenie: Plan Your Trip via Chat")

    chatbot = gr.Chatbot(height=400, show_label=False)

    with gr.Row():
        msg = gr.Textbox(placeholder="Type your trip details...", scale=8)
        send_btn = gr.Button("Send", variant="primary", scale=1)
        clear_btn = gr.Button("Clear", scale=1)

    # User message input + call agent + update chat
    def user_input(user_msg, chat_history):
        if not user_msg.strip():
            return "", chat_history
        
        print(">> User:", user_msg)
        response = chat_fn(user_msg, chat_history)
        print("<< Agent:", response)
        
        chat_history.append((user_msg, response))
        return "", chat_history

    send_btn.click(user_input, [msg, chatbot], [msg, chatbot])
    msg.submit(user_input, [msg, chatbot], [msg, chatbot])
    clear_btn.click(lambda: ([], ""), outputs=[chatbot, msg])

if __name__ == "__main__":
    demo.launch()
