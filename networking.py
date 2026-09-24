import socket
import time

SOURCE_IP    = "127.0.0.1"   # Local interface. Final implementation will use 192.168.1.2
BROADCAST_IP = "127.0.0.255" # For testing. Final implementation will be 192.168.1.255
receive_sock  = None
transmit_sock = None

_initialized = False         # Used to enforce explicit initialization of module before any other functions

# Broadcasts the single code of "id"
def broadcast_code(code):
    pass

# Returns the string of "id:id" from player
def receive_codes():
    pass

# Sets up the module before any work is done
def init(network_address):
    pass

