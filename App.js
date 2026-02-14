import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import RNFS from 'react-native-fs';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { Api } from 'telegram/tl';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('phone'); // phone, code, authenticated
  const [client, setClient] = useState(null);
  const [dialogs, setDialogs] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadCounter, setDownloadCounter] = useState(0);

  // Your API credentials from https://my.telegram.org
  const apiId = YOUR_API_ID; // Replace with your API ID
  const apiHash = 'YOUR_API_HASH'; // Replace with your API Hash
  const stringSession = new StringSession(''); // Save this for future logins

  useEffect(() => {
    requestStoragePermission();
  }, []);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        if (
          granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Storage permissions granted');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const initTelegramClient = async () => {
    try {
      const newClient = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
      });
      await newClient.connect();
      setClient(newClient);
      return newClient;
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to Telegram');
      console.error(error);
    }
  };

  const sendPhoneNumber = async () => {
    setLoading(true);
    try {
      const newClient = await initTelegramClient();
      await newClient.sendCode(
        {
          apiId: apiId,
          apiHash: apiHash,
        },
        phoneNumber
      );
      setStep('code');
      Alert.alert('Success', 'Verification code sent to your Telegram app');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  const verifyCode = async () => {
    setLoading(true);
    try {
      await client.signIn(
        {
          apiId: apiId,
          apiHash: apiHash,
        },
        {
          phoneNumber: phoneNumber,
          password: async () => {
            // If 2FA is enabled, prompt for password
            return 'your_2fa_password';
          },
          phoneCode: async () => code,
          onError: (err) => console.log(err),
        }
      );
      setIsAuthenticated(true);
      setStep('authenticated');
      loadChats();
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code');
    }
    setLoading(false);
  };

  const loadChats = async () => {
    setLoading(true);
    try {
      const result = await client.getDialogs({
        limit: 100,
      });
      
      const chatsList = result.map(dialog => ({
        id: dialog.id,
        name: dialog.name || dialog.title,
        isChannel: dialog.isChannel,
        isGroup: dialog.isGroup,
        entity: dialog.entity,
      }));
      
      setDialogs(chatsList);
    } catch (error) {
      Alert.alert('Error', 'Failed to load chats');
      console.error(error);
    }
    setLoading(false);
  };

  const loadMessages = async (chat) => {
    setLoading(true);
    setSelectedChat(chat);
    setDownloadCounter(0); // Reset counter for new chat
    
    try {
      const result = await client.getMessages(chat.entity, {
        limit: 100,
      });
      
      const messagesList = result.map(msg => ({
        id: msg.id,
        text: msg.message || '',
        date: msg.date,
        media: msg.media,
        hasPhoto: msg.photo !== undefined,
        hasVideo: msg.video !== undefined,
        hasDocument: msg.document !== undefined,
        file: msg.file,
        message: msg,
      }));
      
      setMessages(messagesList);
    } catch (error) {
      Alert.alert('Error', 'Failed to load messages');
      console.error(error);
    }
    setLoading(false);
  };

  const sanitizeFileName = (name) => {
    // Remove invalid characters from filename
    return name.replace(/[<>:"/\\|?*]/g, '_').trim();
  };

  const downloadMedia = async (message) => {
    try {
      setLoading(true);
      
      // Increment counter
      const currentCounter = downloadCounter + 1;
      setDownloadCounter(currentCounter);

      // Get message text or use default name
      let baseName = message.text || 'media';
      
      // Limit filename length
      if (baseName.length > 100) {
        baseName = baseName.substring(0, 100);
      }
      
      // Sanitize filename
      baseName = sanitizeFileName(baseName);
      
      // Determine file extension
      let extension = '';
      if (message.hasVideo) {
        extension = '.mp4';
      } else if (message.hasPhoto) {
        extension = '.jpg';
      } else if (message.hasDocument) {
        const doc = message.message.document;
        const fileName = doc.attributes?.find(attr => attr.className === 'DocumentAttributeFilename')?.fileName;
        if (fileName) {
          extension = fileName.substring(fileName.lastIndexOf('.'));
        } else {
          extension = '.file';
        }
      }
      
      // Create filename with counter
      const fileName = `${currentCounter}_${baseName}${extension}`;
      
      // Download path
      const downloadPath = `${RNFS.DownloadDirectoryPath}/TelegramDownloads/${selectedChat.name}`;
      
      // Create directory if it doesn't exist
      await RNFS.mkdir(downloadPath, {
        NSURLIsExcludedFromBackupKey: true,
      });
      
      const filePath = `${downloadPath}/${fileName}`;
      
      // Download the file
      const buffer = await client.downloadMedia(message.message, {
        progressCallback: (downloaded, total) => {
          const progress = ((downloaded / total) * 100).toFixed(0);
          console.log(`Downloading: ${progress}%`);
        },
      });
      
      // Save to file
      await RNFS.writeFile(filePath, buffer.toString('base64'), 'base64');
      
      Alert.alert(
        'Success',
        `Downloaded: ${fileName}\nLocation: ${downloadPath}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', `Failed to download: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderLoginScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Telegram Downloader</Text>
      
      {step === 'phone' && (
        <View style={styles.form}>
          <Text style={styles.label}>Enter your phone number:</Text>
          <TextInput
            style={styles.input}
            placeholder="+1234567890"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={sendPhoneNumber}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Sending...' : 'Send Code'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {step === 'code' && (
        <View style={styles.form}>
          <Text style={styles.label}>Enter verification code:</Text>
          <TextInput
            style={styles.input}
            placeholder="12345"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={verifyCode}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Verifying...' : 'Verify'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => loadMessages(item)}
    >
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatType}>
          {item.isChannel ? 'Channel' : item.isGroup ? 'Group' : 'Chat'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }) => (
    <View style={styles.messageItem}>
      <Text style={styles.messageText}>{item.text || 'Media message'}</Text>
      
      {(item.hasPhoto || item.hasVideo || item.hasDocument) && (
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => downloadMedia(item)}
        >
          <Text style={styles.downloadButtonText}>
            📥 Download {item.hasVideo ? 'Video' : item.hasPhoto ? 'Photo' : 'File'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderChatList = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Your Chats</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0088cc" />
      ) : (
        <FlatList
          data={dialogs}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );

  const renderMessageList = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedChat(null)}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.chatTitle}>{selectedChat.name}</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0088cc" />
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );

  if (!isAuthenticated) {
    return renderLoginScreen();
  }

  if (selectedChat) {
    return renderMessageList();
  }

  return renderChatList();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#0088cc',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0088cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
  },
  chatItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chatType: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  messageItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  downloadButton: {
    backgroundColor: '#0088cc',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#0088cc',
    fontWeight: 'bold',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default App;
