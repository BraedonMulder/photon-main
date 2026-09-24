import socket
import time

# SOURCE_IP    = "127.0.0.1"   # Local interface. Final implementation will use 192.168.1.2
# BROADCAST_IP = "127.0.0.255" # For testing. Final implementation will be 192.168.1.255
receive_sock  = None
transmit_sock = None

_initialized = False         # Used to enforce explicit initialization of module before any other functions

# Broadcasts the single code of "id"
def broadcast_code(code):
    if not _initialized:
        raise RuntimeError("networking.py is not initialized. call networking.init(network_address) before other functions.")

# Returns the string of "id:id" from player
def receive_codes():
    if not _initialized:
        raise RuntimeError("networking.py is not initialized. call networking.init(network_address) before other functions.")

# Sets up the module before any work is done
def init(network_address=None):
    global _initialized
    if _initialized:
        raise RuntimeError("networking.py has already been initialized.")
    #checks if the function has been initialized before

    if network_address is not None:
        parts = network_address.split(".")
        if len(parts) != 4:
            raise RuntimeError("networking.init received a poor ip address and failed to initialize networking.py.")
        for part in parts:
            if not part.isdigit():
                raise RuntimeError("networking.init received a poor ip address and failed to initialize networking.py.")
    else:
        network_address = "127.0.0.1"
    print(f"Using network address : {network_address}")
    # Checks if the received ip is valid

    global receive_sock
    global transmit_sock
    
    transmit_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)    # Sets socket to IPv4 and UDP.
    transmit_sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1) # Allows the socket to broadcast.
    transmit_sock.connect(("127.0.0.255", 7500))                        # Tells the OS all .send(message) to be broadcast on the described network with the described port.

    receive_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)     # Sets socket to IPv4 and UDP.
    receive_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)  # Allows the socket to quickly reuse the address in case of failure.
    receive_sock.bind((network_address, 7501))                          # Listen on network_address:7501
    receive_sock.settimeout(0.01)                                       # Sets the time in seconds that the socket will block before moving on when listening for traffic.
#    _rx_sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 65536)    # Increase the packet buffer, probably not needed.


    _initialized= True
    print("Finished initializtion of networking.py")

#init()
#receive_codes()
#broadcast_code(5)
