import socket
import time

# SOURCE_IP    = "127.0.0.1"   # Local interface. Final implementation will use 192.168.1.2
# BROADCAST_IP = "127.0.0.255" # For testing. Final implementation will be 192.168.1.255
TRANSMIT_PORT = 7500
RECEIVE_PORT  = 7501
BUFFER_SIZE   = 1024
receive_sock  = None
transmit_sock = None

_initialized = False         # Used to enforce explicit initialization of module before any other functions

# Broadcasts the single code of an int : id
def broadcast_code(code):
    if not _initialized:
        raise RuntimeError("networking.py is not initialized. call networking.init(source_address) before other functions.")
    if   isinstance(code, str):
        message = code
    elif isinstance(code, int):
        message = str(code)
    else:
        raise RuntimeError("Received a faulty code to transmit.")
#       print("Received a faulty code to transmit.")                  # A quiet failure for use in actual application
#       return
    #Above insists that it receives an int or a string, message is a string either way

    try:
        transmit_sock.sendto((message + '\0').encode("utf-8"), ("255.255.255.255", 7500))
    except socket.gaierror as e: # Recoverable, deinit, then reinit
        print(f"[NETWORK ERROR] Bad address or unresolvable host : {e}")
        raise
    except Exception as e:
        raise 

# Returns the tuple of ints (player who shot, player who got hit) as their equipment codes
def receive_codes():
    if not _initialized:
        raise RuntimeError("networking.py is not initialized. call networking.init(source_address) before other functions.")
    # recieve packet, strip the id:id, format the id:id, return tuple(id, id)
    try:
        message, _ = receive_sock.recvfrom(1024)
        data = message.decode("utf-8").rstrip('\0').strip()     # Removes \0, whitespaces, newlines, tabs, etc...
        if ":" in data:
            shooter, target = data.split(":",1)
            return (int(shooter), int(target))
    except TimeoutError:
        return None                                             # Required for non-blocking packet listening.
    except (UnicodeDecodeError, ValueError) as e:
        print(f"[DATA ERROR] Received malformed packet : {e}")
        print("proceeding")
        return None
    except Exception as e:
        raise

# Sets up the module before any work is done
def init(source_address=None):
    global _initialized
    if _initialized:
        raise RuntimeError("networking.py has already been initialized.")
    #checks if the function has been initialized before

    if source_address is not None:
        parts = source_address.split(".")
        if len(parts) != 4:
            raise RuntimeError("networking.init received a poor ip address and failed to initialize networking.py.")
        for part in parts:
            if not part.isdigit():
                raise RuntimeError("networking.init received a poor ip address and failed to initialize networking.py.")
    else:
        source_address = "127.0.0.1"
    print(f"Using network address : {source_address}")
    # Checks if the received ip is valid

    global receive_sock
    global transmit_sock
    
    try: 
        transmit_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)    # Sets socket to IPv4 and UDP.
        transmit_sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1) # Allows the socket to broadcast.
        transmit_sock.bind((source_address, 0))                          # Binds the socket to send ports out of source_address

        receive_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)     # Sets socket to IPv4 and UDP.
        receive_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)  # Allows the socket to quickly reuse the address in case of failure.
        receive_sock.bind(("0.0.0.0", RECEIVE_PORT))                        # Listen for any ip address:port RECEIVE_PORT
        receive_sock.settimeout(0.01)                                       # Sets the time in seconds that the socket will block before moving on when listening for traffic.
    #    _rx_sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 65536)    # Increase the packet buffer, probably not needed.
    except OSError as e:
        if transmit_sock:
            transmit_sock.close()
        if receive_sock:
            receive_sock.close()
        raise OSError(f"Failed to bind networking sockets : {e}")           # Can be changed later to allow retrys of init
    except Exception as e:
        raise


    _initialized= True
    print("Finished initializtion of networking.py")

#init()
##receive_codes()
#broadcast_code(221)
#while(True):
#    data = receive_codes()
#    if data is not None:
#        print(data)
#        broadcast_code(data[0])
# Lines for testing against the traffic generator
