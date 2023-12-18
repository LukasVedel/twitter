import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',  
    alignItems: 'center',
    paddingHorizontal: 5,
    padding: 24,
    paddingTop: 80,
    
  },
  headerContainer: {
    width: '100%',  
    flexDirection: 'row',
    justifyContent: 'space-between',  
    alignItems: 'center',
    paddingTop: 10,  
  },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
      },
      modalItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      modalItemText: {
        fontSize: 18,
        color: 'blue',
      },
      deleteText: {
        color: 'red',
      },
      closeButton: {
        marginTop: 10,
        alignSelf: 'flex-end',
      },
      closeButtonText: {
        fontSize: 18,
        color: 'blue',
      },
      emailContainer: {
        alignItems: 'center',
        marginVertical: 20,
      },
      emailText: {
        fontSize: 16,
        color: '#333',
      },
      menuIcon: {
        position: 'absolute',
        top: 3,  
        right: 5,
      },

      
      
});

export default styles;


